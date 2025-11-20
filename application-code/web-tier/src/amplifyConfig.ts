// src/amplifyConfig.ts
import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_TmfJAnXDA",
      userPoolClientId: "ho13hgmvg468qo9b2rqornsck",
    },
  },
});

export default Amplify;
