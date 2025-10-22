import { useMemo } from "react";
import "./stylesheets/comparerResult.css";

export default function ComparerResult({
  intersectionState,
  setIntersectionState,
}) {
  const result = useMemo(() => {
    if (intersectionState === "yes") return intersectionFound();
    if (intersectionState === "no") return intersectionNotFound();
    if (intersectionState === "fail") return intersectionError();
    return null;
  }, [intersectionState]);

  if (intersectionState === "null") {
    return (
      <div
        className="comparer-result"
        style={{ opacity: 0, pointerEvents: "none" }}
      ></div>
    );
  }

  return (
    <div
      className="comparer-result"
      style={{ opacity: 1, pointerEvents: "all" }}
    >
      <button onClick={() => setIntersectionState("null")}><p>X</p></button>
      {result}
    </div>
  );
}

function intersectionFound() {
  return (
    <div>
      <p>
        Your site is near a culturally significant site listed by TLaWC. You
        require a {" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.firstpeoplesrelations.vic.gov.au/cultural-heritage-management-plans"
          style={{ margin: 0, padding: 0 }}
        >
          Cultural Heritage Management Plan
        </a>
        .
      </p>
      <p>Send your site details to TLaWC using the form below:</p>
      <form>
        <p>
          Name
          <br />
          <input type="text"></input>
        </p>
        <p>
          Contact/Email address
          <br />
          <input type="text"></input>
        </p>
        <input type="submit"></input>
      </form>
    </div>
  );
}

function intersectionNotFound() {
  return (
    <div>
      <h3>Intersection Not Found</h3>
      <p>
        Your site is not within the defined radius of any cultural heritage
        sites listed by the Taungurung Land and Water Council.
      </p>
    </div>
  );
}

function intersectionError() {
  return (
    <div>
      <p>Intersection Error</p>
    </div>
  );
}
