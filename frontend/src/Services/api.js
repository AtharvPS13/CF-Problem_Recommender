import axios from 'axios';

export const recommendProblems = async (handle) =>{

    if(!handle.trim()) {
        return {
            success:false,
            error :"Handle cannot be empty"
        };
    }
    try {
        const BASE_URL = "https://cf-problem-recommender.onrender.com";
        const response = await axios.post(
        `${BASE_URL}/recommend`,
        { handle: handle.trim() },
        {
            headers: {
            'Content-Type': 'application/json'
            }
        }
        );
        return {
            success:true,
            recommendations : response.data.recommendations,
            data:response.data
        };
    } catch(error) {
        console.log("Recommendations API Failed:",error);
        return {
            success:false,
            error: error.response?.data?.message || "Failed to fetch recommendations"
        }
    }
}

export const fetchAccuracy = async () => {
    try {
        const response = await axios.get(`https://cf-problem-recommender.onrender.com/api/rating-accuracy`);

        return {
            rating_accuracy : response.data.rating_accuracy,
            tags_accuracy : response.data.tag_accuracy,
            success:true
        };
    } catch(error){
        console.error("Error fetching Accuracies",error);
        return {
            success: false,
            error: error.message
        };  
     }
};