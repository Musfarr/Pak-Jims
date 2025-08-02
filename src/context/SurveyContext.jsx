import React, { createContext, useContext, useState } from 'react';

const SurveyContext = createContext();

export const SurveyProvider = ({ children }) => {
  // Initialize from localStorage if present
  const [surveyAssignmentIds, setSurveyAssignmentIds] = useState(() => {
    const stored = localStorage.getItem('surveyAssignmentIds');
    return stored ? JSON.parse(stored) : null;
  });
  const [currentReportId, setCurrentReportId] = useState(() => {
    return localStorage.getItem('currentReportId') || null;
  });

  // Persist to localStorage when set
  const setSurveyData = (ids, reportId) => {
    setSurveyAssignmentIds(ids);
    setCurrentReportId(reportId);
    localStorage.setItem('surveyAssignmentIds', JSON.stringify(ids));
    localStorage.setItem('currentReportId', reportId);
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
