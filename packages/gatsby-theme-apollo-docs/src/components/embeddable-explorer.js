import React, { useEffect } from "react";

const SUBSCRIPTION_TERMINATION = "ExplorerSubscriptionTermination";
const EXPLORER_QUERY_MUTATION_REQUEST = "ExplorerRequest";
const EXPLORER_SUBSCRIPTION_REQUEST = "ExplorerSubscriptionRequest";
const EXPLORER_QUERY_MUTATION_RESPONSE = "ExplorerResponse";
const EXPLORER_SUBSCRIPTION_RESPONSE = "ExplorerSubscriptionResponse";

function getHeadersWithContentType(headers) {
  const headersWithContentType = headers ?? {};
  if (
    Object.keys(headersWithContentType).every(
      (key) => key.toLowerCase() !== "content-type"
    )
  ) {
    headersWithContentType["content-type"] = "application/json";
  }
  return headersWithContentType;
}

async function executeOperation({
  operation,
  operationName,
  variables,
  headers,
  embeddedExplorerIFrame,
  operationId,
  url,
}) {
  const response = await fetch(url, {
    method: "POST",
    headers: getHeadersWithContentType(headers),
    body: JSON.stringify({
      query: operation,
      variables,
      operationName,
    }),
  });
  await response.json().then((response) => {
    embeddedExplorerIFrame?.contentWindow?.postMessage(
      {
        name: `${EXPLORER_QUERY_MUTATION_RESPONSE}:${operationId}`,
        response,
      },
      EMBEDDABLE_EXPLORER_URL
    );
  });
}

async function executeSubscription({
  operation,
  operationName,
  variables,
  headers,
  embeddedExplorerIFrame,
  operationId,
  url,
}) {
  const getClient = () => {
    try {
      return new SubscriptionClient(url, {
        reconnect: true,
        lazy: true,
        connectionParams: headers ?? {},
      });
    } catch {
      return undefined;
    }
  };
  const client = getClient();

  client
    ?.request({
      query: operation,
      operationName,
      variables: variables ?? undefined,
    })
    .subscribe({
      next(response) {
        embeddedExplorerIFrame?.contentWindow?.postMessage(
          {
            name: `${EXPLORER_SUBSCRIPTION_RESPONSE}:${operationId}`,
            response,
          },
          EMBEDDABLE_EXPLORER_URL
        );
      },
    });

  const checkForSubscriptionTermination = (event) => {
    if (event.data.name?.startsWith(SUBSCRIPTION_TERMINATION)) {
      client?.unsubscribeAll();
      window.removeEventListener("message", checkForSubscriptionTermination);
    }
  };

  window.addEventListener("message", checkForSubscriptionTermination);
}

export const EmbeddedExplorer = ({
  graphRef,
  graphEndpoint,
  graphSubscriptionEndpoint,
  styles,
}) => {
  const EMBEDDABLE_EXPLORER_URL = useMemo(() => {
    return `https://explorer.embed.apollographql.com/?graphRef=${graphRef}&docsPanelState=closed`;
  }, [graphRef]);

  useEffect(() => {
    const onPostMessageReceived = (event) => {
      const isQueryOrMutation =
        "name" in event.data &&
        event.data.name?.startsWith(`${EXPLORER_QUERY_MUTATION_REQUEST}:`);
      const isSubscription =
        "name" in event.data &&
        event.data.name?.startsWith(`${EXPLORER_SUBSCRIPTION_REQUEST}:`);

      if (
        (isQueryOrMutation || isSubscription) &&
        event.data.name &&
        event.data.operation
      ) {
        const operationId = event.data.name.split(":")[1];
        const embeddedExplorerIFrame =
          document.getElementById("embedded-explorer") ?? undefined;
        const { operation, operationName, variables, headers } = event.data;
        if (isQueryOrMutation) {
          executeOperation({
            operation: event.data.operation,
            operationName,
            variables,
            headers,
            embeddedExplorerIFrame,
            operationId,
            url: graphEndpoint,
          });
        } else {
          executeSubscription({
            operation,
            operationName,
            variables,
            headers,
            embeddedExplorerIFrame,
            operationId,
            url: graphSubscriptionEndpoint,
          });
        }
      }
    };
    window.addEventListener("message", onPostMessageReceived);

    return () => window.removeEventListener("message", onPostMessageReceived);
  }, []);

  return (
    <iframe
      id="embedded-explorer"
      style={styles}
      title="embedded-explorer"
      src={EMBEDDABLE_EXPLORER_URL}
    />
  );
};
