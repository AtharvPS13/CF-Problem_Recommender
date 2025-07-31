import { useContext, createContext, useEffect, useState } from "react";

const ProblemContext = createContext();

export function ProblemProvider({children}) {
    
    const [problemsList, setProblemsList] = useState(()=>{
        const saved = localStorage.getItem("cfProblemsData");
        return saved ? JSON.parse(saved):{};
    })  
    
    useEffect(() => {
      localStorage.setItem("cfProblemsData",JSON.stringify(problemsList))
    }, [problemsList])
    
    const updateProblems = (handle,problems) => {
      setProblemsList(prev => ({
        ...prev,
        [handle]: {
          problems,
          timestamp:Date.now()
        }
      }))
    }

    const getProblems =(handle) => {
      return problemsList[handle]?.problems || [];
    }

    return (
      <ProblemContext.Provider value={{ problemsList, updateProblems, getProblems }}>
        {children}
      </ProblemContext.Provider>
    )
}

export { ProblemContext };