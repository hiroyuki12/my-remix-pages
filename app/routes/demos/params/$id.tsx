import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import {
  data,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "react-router";

// The `$` in route filenames becomes a pattern that's parsed from the URL and
// passed to your loaders so you can look up data.
// - https://remix.run/api/conventions#loader-params
export const loader = async ({ params }: LoaderFunctionArgs) => {
  // pretend like we're using params.id to look something up in the db

  if (params.id === "this-record-does-not-exist") {
    // If the record doesn't exist we can't render the route normally, so
    // instead we throw a 404 reponse to stop running code here and show the
    // user the catch boundary.
    throw new Response("Not Found", { status: 404 });
  }

  // now pretend like the record exists but the user just isn't authorized to
  // see it.
  if (params.id === "shh-its-a-secret") {
    // Again, we can't render the component if the user isn't authorized. You
    // can even put data in the response that might help the user rectify the
    // issue! Like emailing the webmaster for access to the page. (Oh, right,
    // `json` is just a Response helper that makes it easier to send JSON
    // responses).
    throw data({ webmasterEmail: "hello@remix.run" }, { status: 401 });
  }

  // Sometimes your code just blows up and you never anticipated it. Remix will
  // automatically catch it and send the UI to the error boundary.
  if (params.id === "kaboom") {
    // @ts-expect-error intentionally undefined to demo ErrorBoundary
    lol();
  }

  // but otherwise the record was found, user has access, so we can do whatever
  // else we needed to in the loader and return the data. (This is boring, we're
  // just gonna return the params.id).
  return { param: params.id };
};

export default function ParamDemo() {
  let { param } = useLoaderData<typeof loader>();
  return (
    <h1>
      The param is <i style={{ color: "red" }}>{param}</i>
    </h1>
  );
}

// https://reactrouter.com/how-to/error-boundary
export function ErrorBoundary() {
  let error = useRouteError();

  if (isRouteErrorResponse(error)) {
    let message: React.ReactNode;
    switch (error.status) {
      case 401:
        message = (
          <p>
            Looks like you tried to visit a page that you do not have access to.
            Maybe ask the webmaster ({error.data.webmasterEmail}) for access.
          </p>
        );
        break;
      case 404:
        message = (
          <p>Looks like you tried to visit a page that does not exist.</p>
        );
        break;
      default:
        message = (
          <p>
            There was a problem with your request!
            <br />
            {error.status} {error.statusText}
          </p>
        );
    }

    return (
      <>
        <h2>Oops!</h2>
        {message}
        <p>
          (Isn't it cool that the user gets to stay in context and try a
          different link in the parts of the UI that didn't blow up?)
        </p>
      </>
    );
  }

  console.error(error);
  return (
    <>
      <h2>Error!</h2>
      <p>{error instanceof Error ? error.message : "Unknown error"}</p>
      <p>
        (Isn't it cool that the user gets to stay in context and try a different
        link in the parts of the UI that didn't blow up?)
      </p>
    </>
  );
}

export let meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data ? `Param: ${data.param}` : "Oops..." },
];
