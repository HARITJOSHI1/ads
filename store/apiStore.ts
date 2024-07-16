const getApi = () => {
    const base = "/api";
  return {
    campaign: {
      create: { url: `${base}/create-campaign`, method: "POST" },
      update: { url: `${base}/update-campaign`, method: "PATCH" },
    },

    schedule: {
        create: { url: `${base}/create-schedule`, method: "POST" },
        update: { url: `${base}/update-schedule`, method: "PATCH" },
      },
  };
};

export default getApi