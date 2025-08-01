import React, { createContext, useContext, useState } from 'react';

const SurveyContext = createContext();

export const SurveyProvider = ({ children }) => {
  const [surveyAssignmentIds, setSurveyAssignmentIds] = useState(null);
  const [currentReportId, setCurrentReportId] = useState(null);

  const setSurveyData = (ids, reportId) => {
    setSurveyAssignmentIds(ids);
    setCurrentReportId(reportId);
  };

  return (
    <SurveyContext.Provider 
      value={{ 
        surveyAssignmentIds, 
        currentReportId,
        setSurveyData 
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};
