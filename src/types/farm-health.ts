
export type FarmHealthAlert = {
    id: string;
    title: string;
    description: string;
    risk: string;
};

export type FarmHealthData = {
  overallScore: number;
  soilQuality: {
    status: string;
    ph: number;
    nitrogen: number;
  };
  cropVigor: {
    status: string;
    ndvi: number;
  };
  pestDiseaseRisk: {
    status: string;
  };
  fieldStatus: {
    id: string;
    name: string;
    crop: string;
    status: string;
  }[];
  activeAlerts: FarmHealthAlert[];
};
