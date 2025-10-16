import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="home">
      <h2>
        Taungurung Land and Water Council Cultural Heritage Digital Infrastructure
      </h2>
      <h3>
        Component: <i>Decoupling TLaWC from ACHRIS</i>
      </h3>
      <h4>About</h4>
      <p>
        This website showcases the projects that I worked on as part of my
        component contribution to our group's proposed{" "}
        <i>
          Taungurung Land and Water Council Cultural Heritage Digital Infrastructure
        </i>
        .
        <br />
      </p>
      <h4>Developer Map</h4>
      <p>
        This map mimics the ACHRIS public map accessible at{" "}
        <a
          href="https://achris.vic.gov.au/#/onlinemap"
          target="_blank"
          rel="noreferrer"
        >
          https://achris.vic.gov.au/#/onlinemap
        </a>
        .
        <br />
        <br />
        The rationale for this component is to separate the proposed TLaWC
        Cultural Heritage Digital Infrastructure from the functionalities
        provided by ACHRIS to further TLaWC's self responsibility and control
        over their own data
      </p>
      <h4>VAHR Form Filler</h4>
      <p>
        This app showcases the ability to automatically fill VAHR submission
        forms, using data from within the TLaWC Cultural Heritage Digital
        Infrastructure database. As this is a prototype, the app pulls from data
        which has been randomly generated in advance.
        <br />
        <br />
        The rationale for this component is to reduce the workload required for
        Taungurung Land and Water Council to complete VAHR submission forms and
        fulfil their obligations to ACHRIS, so they can better use those
        resources elsewhere.
      </p>
    </div>
  );
}
