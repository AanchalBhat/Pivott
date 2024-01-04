import { getCompanyDomain } from ".";

var SplitFactory = require("@splitsoftware/splitio").SplitFactory;

let ENV = process.env.REACT_APP_ENV;
let client;

if (ENV !== "development") {
  // Instantiate the SDK
  const domain = getCompanyDomain();

  var factory = SplitFactory({
    core: {
      authorizationKey: process.env.REACT_APP_SPLIT_IO_SDK_KEY,
      key: domain,
    },
  });

  client = factory.client();
  await client.ready();
}

const localFeatureFlag = {
  enable_feature_campaign: true,
  enable_invite_link: true,
};

let featureFlagCache = {};

function localTreatment(flagName) {
  return localFeatureFlag[flagName];
}

function serverTreatment(flagName) {
  if (featureFlagCache[flagName] !== undefined) {
    return featureFlagCache[flagName];
  }
  return (featureFlagCache[flagName] = client.getTreatment(flagName) === "on");
}

export const featureFlag = (flagName) => {
  if (ENV === "development") {
    return localTreatment(flagName);
  }
  return serverTreatment(flagName);
};
