import { Add, Edit, TrashCan } from "@carbon/icons-react";
import {
  RowFlex,
  Spinner,
  Table,
  TextStyledLink,
  useModalContext,
} from "common";
import { orderBy } from "lodash";
import { useVendorUserVendor } from "modules/VendorUserLandingPage";
import React, { Fragment } from "react";
import { useParams } from "react-router-dom";
import FollowUpForm from "./FollowUpForm";

const FollowUps = ({ callAxios, loading }) => {
  const { setModalContent, closeModal } = useModalContext();
  const { vendorRequestId } = useParams();
  const { vendor } = useVendorUserVendor();
  const vendorRequest = vendor.vendorRequests?.find(
    (vr) => vr.id === vendorRequestId
  );
  return (
    <Fragment>
      <RowFlex>
        <h3>Follow Ups</h3>
        <TextStyledLink>
          <Add
            onClick={() => {
              setModalContent(
                <FollowUpForm
                  emails={vendorRequest.emails}
                  onSubmit={(followUp) => {
                    callAxios({
                      method: "PUT",
                      url: `vendorRequests/${vendorRequest.id}`,
                      data: {
                        followUps: [...vendorRequest.followUps, followUp],
                      },
                    });
                    closeModal();
                  }}
                />
              );
            }}
          />
        </TextStyledLink>
      </RowFlex>
      {vendorRequest.followUps.length > 0 && (
        <Table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Via</th>
              <th>Email</th>
              <th>Notes</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {orderBy(
              vendorRequest.followUps,
              (f) => new Date(f.date),
              "desc"
            ).map((followUp) => (
              <tr key={followUp._id}>
                <td>{new Date(followUp.date).toLocaleDateString()}</td>
                <td>{followUp.via}</td>
                <td>{followUp.email}</td>
                <td dangerouslySetInnerHTML={{ __html: followUp.notes }} />
                <td>
                  <TextStyledLink>
                    {loading ? (
                      <Spinner inline />
                    ) : (
                      <TrashCan
                        onClick={() =>
                          callAxios({
                            method: "PUT",
                            url: `vendorRequests/${vendorRequest.id}`,
                            data: {
                              followUps: vendorRequest.followUps.filter(
                                (f) => f._id !== followUp._id
                              ),
                            },
                          })
                        }
                      />
                    )}
                  </TextStyledLink>
                </td>
                <td>
                  <TextStyledLink>
                    {loading ? (
                      <Spinner inline />
                    ) : (
                      <Edit
                        onClick={() =>
                          setModalContent(
                            <FollowUpForm
                              followUp={followUp}
                              emails={vendorRequest.emails}
                              onSubmit={(edited) => {
                                callAxios({
                                  method: "PUT",
                                  url: `vendorRequests/${vendorRequest.id}`,
                                  data: {
                                    followUps: vendorRequest.followUps.map(
                                      (f) => (f._id === edited._id ? edited : f)
                                    ),
                                  },
                                });
                                closeModal();
                              }}
                            />
                          )
                        }
                      />
                    )}
                  </TextStyledLink>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Fragment>
  );
};

export default FollowUps;
