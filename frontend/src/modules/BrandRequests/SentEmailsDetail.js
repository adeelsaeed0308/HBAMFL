import { GridContainer, TextField } from "common";
import { format } from "date-fns";
import React from "react";

const SentEmailsDetail = ({ vendor, sentEmails }) => {
  return (
    <div style={{ justifySelf: "normal" }}>
      <h3>
        E-mail history for <i>{vendor?.name}</i>
      </h3>
      <div style={{ maxHeight: "80vh", overflow: "auto" }}>
        {sentEmails.toReversed().map((email) => (
          <GridContainer>
            <TextField
              label={"Time"}
              value={format(new Date(email?.timestamp), "hh:mm a MMM dd, yyyy")}
              readOnly
            />
            <TextField
              label={"Contacts"}
              value={email?.contacts.map(
                (contact, index) => `${contact.name}, `
              )}
              readOnly
            />
            <TextField label={"Subject"} value={email?.subject} readOnly />
            <TextField label={"Body"} value={email?.body} isArea readOnly />
          </GridContainer>
        ))}
      </div>
    </div>
  );
};

export default SentEmailsDetail;
