import React, { useEffect, useState } from "react";
import { Box, Button, Grid, InputLabel, Link, Modal, Paper, Rating, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import axios from "axios";
import logo from '../assets/images/logo-gif.gif';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

interface UserDetails {
  score: number;
  correct_answers: number;
  total_questions: number;
  incorrect_questions?: Array<{
    question_id: number;
    question: string;
    correct_answer: string;
    selected_option: string;
  }>;
}

const Result: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    score: 0,
    correct_answers: 0,
    total_questions: 0,
    incorrect_questions: [],
  });
  const [answersVisible, setAnswersVisible] = useState(true);
  const [rating, setRating] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const handleRatingChange = (newRating: number | null) => {
    setRating(newRating);
  };

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
        setUserDetails(response.data);
      } catch (error) {
        toast.error("Unable to fetch results");
      } finally {
        setLoading(false);
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

  if (loading) {
    return <div><Loading /></div>;
  }
  const handleShowAnswers = () => {
    setShowAnswers(true);
    setOpenModal(true);
  };

  return (
    <>
      <div>
        <div className="App">
          <nav className="fixed-navbar">
            <Link href="/Home">
              <img src={logo} className="nav--icon" alt="Learn Now Logo" />
            </Link>
            <h3 className="nav--logo_text">LEARN NOW</h3>
          </nav>
          <h1>Your Results!</h1>
          <div >
            <Typography variant="h6">Score: {userDetails.score}</Typography>
            <Typography variant="body1">
              Correct Answers: {userDetails.correct_answers}
            </Typography>
            <Typography variant="body1">
              Total Questions: {userDetails.total_questions}
            </Typography>
            <div style={{ marginLeft: '40%' }}>
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
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', marginLeft: '40%', marginRight: '40%' }}>
              <Button variant="contained" onClick={handleExit}>
                Exit Quiz
              </Button>
              <Button variant="contained" onClick={handleShowAnswers}>
                Show Answers
              </Button>
            </div>
            {showAnswers && answersVisible && (
              <>
                <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box sx={{ width: 900, height: 600, margin: 'auto', marginTop: '50px', overflowY: 'auto' }}>
                    <Paper sx={{ padding: 2 }}>
                      <Typography variant="h6" style={{ marginLeft: "40%", fontWeight: 600 }}>Incorrect Answers</Typography>
                      {userDetails.incorrect_questions && userDetails.incorrect_questions.map((incorrectQuestion) => (
                        <div key={incorrectQuestion.question_id}>
                          <Typography variant="body1">
                            Question: {incorrectQuestion.question}
                          </Typography>
                          <Typography variant="body1">
                            Answer Submitted: {incorrectQuestion.selected_option}
                          </Typography>
                          <Typography variant="body1">
                            Correct Answer: {incorrectQuestion.correct_answer}
                          </Typography>
                          <Typography variant="body1">
                            --------------------------------------------------------------
                          </Typography>
                        </div>
                      ))}
                    </Paper>
                  </Box>
                </Modal>
              </>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <InputLabel style={{ marginBottom: '10px' }}>Rate the Quiz:</InputLabel>
          <Rating
            name="quiz-rating"
            value={rating}
            onChange={(event, newRating) => handleRatingChange(newRating)}
          />
        </div>
      </div>
    </>
  );
};

export default Result;
