import { Add, Download, Edit, TrashCan } from "@carbon/icons-react";
import {
  fetchImage,
  formatNumber,
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
import OrderForm from "./OrderForm";

const Orders = ({ callAxios, loading }) => {
  const { setModalContent, closeModal } = useModalContext();
  const { vendorRequestId } = useParams();
  const { vendor } = useVendorUserVendor();
  const vendorRequest = vendor.vendorRequests?.find(
    (vr) => vr.id === vendorRequestId
  );
  return (
    <Fragment>
      <RowFlex>
        <h3>Orders</h3>
        <TextStyledLink>
          <Add
            onClick={() => {
              setModalContent(
                <OrderForm
                  onSubmit={(order) => {
                    callAxios({
                      method: "PUT",
                      url: `vendorRequests/${vendorRequest.id}`,
                      data: {
                        orders: [...vendorRequest.orders, order],
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
      {vendorRequest.orders.length > 0 && (
        <Table>
          <thead>
            <tr>
              <th>Order Date</th>
              <th>Pickup Date</th>
              <th>Invoice</th>
              <th>Total</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {orderBy(
              vendorRequest.orders,
              (f) => new Date(f.orderDate),
              "desc"
            ).map((order) => (
              <tr key={order._id}>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>
                  {order.pickupDate &&
                    new Date(order.pickupDate).toLocaleDateString()}
                </td>
                <td>
                  {order.invoice && (
                    <TextStyledLink>
                      <a
                        href={fetchImage(order.invoice)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Download />
                      </a>
                    </TextStyledLink>
                  )}
                </td>
                <td>${formatNumber(order.total)}</td>
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
                              orders: vendorRequest.orders.filter(
                                (f) => f._id !== order._id
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
                            <OrderForm
                              order={order}
                              onSubmit={(edited) => {
                                callAxios({
                                  method: "PUT",
                                  url: `vendorRequests/${vendorRequest.id}`,
                                  data: {
                                    orders: vendorRequest.orders.map((f) =>
                                      f._id === edited._id ? edited : f
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

export default Orders;
