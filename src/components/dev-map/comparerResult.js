export function chmpRequired() {
  return (`
    <div>
      <p style="margin:0; padding:0;">
        Your site is near a culturally significant site listed by TLaWC. You
        require a
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.firstpeoplesrelations.vic.gov.au/cultural-heritage-management-plans"
          style="margin:0; padding:0;"
        >
          Cultural Heritage Management Plan
        </a>
        .
      </p>
      <p>Send your site details to TLaWC using the form below:</p>
      <form>
        <p>Name<br/><input type="text"></input></p>
        <p>Contact/Email address<br/><input type="text"></input></p> 
        <input type="submit"></input>
      </form>
      </p>
    </div>`
  );
}

export function chmpNotRequired() {
  return {};
}
