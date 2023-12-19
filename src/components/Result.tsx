import React, { useEffect, useState } from "react";
import backgroundimageoflandingpage from "../assets/images/giphy.gif";
import { Button, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Result: React.FC = () => {
  const [userDetails, setUserDetails] = useState({
    score: 0,
    correct_answers: 0,
    total_questions: 0,
  });
  const navigate = useNavigate();

  const fetchResults = async () => {
    const answerSubmit = localStorage.getItem("answers");
    if (answerSubmit) {
      try {
        const savedAccessToken = localStorage.getItem("AccessToken");
        const response = await axios.post(
          "http://localhost:3000/submitanswer",
          answerSubmit,
          {
            headers: {
              'Content-Type': 'application/json',
              'token': `${savedAccessToken}`,
            },
          }
        );
        console.log("API Response:", response.data);

        // Update state with the API response
        setUserDetails(response.data);
      } catch (error) {
        toast.error("Unable to fetch results");
      }
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleExit = () => {
    localStorage.removeItem("userDetails");
    localStorage.removeItem("answers")
    navigate('/Home')
  };

  return (
    <>
    <div >
    <div className="App">
      <h1>Your Results!</h1>
      <div>
        <Typography variant="h6">Score: {userDetails.score}</Typography>
        <Typography variant="body1">
          Correct Answers: {userDetails.correct_answers}
        </Typography>
        <Typography variant="body1">
          Total Questions: {userDetails.total_questions}
        </Typography>
        <PieChart
          colors={["green", "red"]}
          series={[
            {
              data: [
                {
                  id: 0,
                  value: userDetails.correct_answers,
                  label: "Correct",
                },
                {
                  id: 1,
                  value:
                    userDetails.total_questions - userDetails.correct_answers,
                  label: "Wrong",
                },
              ],
            },
          ]}
          width={400}
          height={200}
        />
        <Button variant="contained" onClick={handleExit}>
          Exit Quiz
        </Button>
      </div>
    </div>
    </div>
    </>
  );
};

export default Result;
