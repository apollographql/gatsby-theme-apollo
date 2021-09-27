import PropTypes from "prop-types";
import React, { useEffect, useMemo } from "react";
import { SubscriptionClient } from "subscriptions-transport-ws";

const EXPLORER_SUBSCRIPTION_TERMINATION = "ExplorerSubscriptionTermination";
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
        name: EXPLORER_QUERY_MUTATION_RESPONSE,
        operationId,
        response,
      },
      embeddedExplorerIFrame?.src
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
            name: EXPLORER_SUBSCRIPTION_RESPONSE,
            operationId,
            response,
          },
          embeddedExplorerIFrame?.src
        );
      },
    });

  const checkForSubscriptionTermination = (event) => {
    if (event.data.name === EXPLORER_SUBSCRIPTION_TERMINATION) {
      client?.unsubscribeAll();
      window.removeEventListener("message", checkForSubscriptionTermination);
    }
  };

  window.addEventListener("message", checkForSubscriptionTermination);
}

export function EmbeddableExplorer({
  graphRef,
  graphEndpoint,
  graphSubscriptionEndpoint,
  defaultOperation,
  defaultVariables,
  defaultHeaders,
  postMessageOperations = true,
  styles,
}) {

  // Don't render embedded explorer in SSR environments
  if (typeof window === 'undefined') {
    return (null);
  }

  const additionalQueryParams =
    `&postMessageOperations=${postMessageOperations ? "true" : "false"}` +
    (defaultOperation ? `&document=${window.encodeURIComponent(defaultOperation)}` : '') +
    (defaultVariables ?`& variables=${window.encodeURIComponent(defaultVariables)}` : '') +
    (defaultHeaders ? `&headers=${window.encodeURIComponent(defaultHeaders)}` : '');

  const EMBEDDABLE_EXPLORER_URL = useMemo(() => {
    return (
      `https://explorer.embed.apollographql.com/?graphRef=${graphRef}&docsPanelState=closed` +
      additionalQueryParams
    );
  }, [graphRef]);

  useEffect(() => {
    const onPostMessageReceived = (event) => {
      const isQueryOrMutation =
        "name" in event.data &&
        event.data.name === EXPLORER_QUERY_MUTATION_REQUEST;
      const isSubscription =
        "name" in event.data &&
        event.data.name === EXPLORER_SUBSCRIPTION_REQUEST;

      if (
        (isQueryOrMutation || isSubscription) &&
        event.data.name &&
        event.data.operation &&
        event.data.operationId
      ) {
        const embeddedExplorerIFrame =
          document.getElementById("embedded-explorer") ?? undefined;
        const { operation, operationId, operationName, variables, headers } =
          event.data;
        if (isQueryOrMutation) {
          executeOperation({
            operation,
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
  }, [graphEndpoint, graphSubscriptionEndpoint]);

  return (
    <iframe
      id="embedded-explorer"
      style={styles}
      title="embedded-explorer"
      src={EMBEDDABLE_EXPLORER_URL}
    />
  );
}

EmbeddableExplorer.propTypes = {
  graphRef: PropTypes.string.isRequired,
  graphEndpoint: PropTypes.string,
  graphSubscriptionEndpoint: PropTypes.string,
  styles: PropTypes.object,
};
