import {
  FormikSubmit,
  FormWrapper,
  Logo,
  TextField,
  useAxios,
  useToast,
} from "common";
import { Field, Form, Formik } from "formik";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formikSchemaResetPassword } from "../LoginProcess/formikSchema";
import { Container, LoginBox, LogoSection } from "../LoginProcess/styles";

const ResetPasswordPage = () => {
  const { callAxios, loading } = useAxios();
  const { onError } = useToast();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const onFormSubmit = (data) => {
    try {
      const { password, confirmPassword } = data;
      if (password === confirmPassword) {
        callAxios({
          url: `/auth/reset/${params.get("token")}`,
          method: "PUT",
          data: { newPassword: password },
        }).then(() => {
          navigate("/");
        });
      } else {
        throw new Error("Passwords should be identical");
      }
    } catch (e) {
      onError(e);
    }
  };

  return (
    <Container>
      <LoginBox>
        <LogoSection>
          <Logo />
        </LogoSection>
        <Formik
          {...formikSchemaResetPassword}
          onSubmit={(data) => onFormSubmit(data)}
        >
          <FormWrapper alignCenter style={{ padding: "1rem" }}>
            <Form
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h3>Reset</h3>
              <Field
                name="password"
                component={TextField}
                label="Password"
                required
                fillWidth
                type="password"
              />
              <Field
                name="confirmPassword"
                component={TextField}
                label="Confirm Password"
                required
                type="password"
                fillWidth
              />
            </Form>
            <FormikSubmit loading={loading}>Reset Pasword</FormikSubmit>
          </FormWrapper>
        </Formik>
      </LoginBox>
    </Container>
  );
};

export default ResetPasswordPage;
