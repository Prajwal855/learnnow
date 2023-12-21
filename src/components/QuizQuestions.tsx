import { useEffect, useState, useRef } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Button,
  Typography,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo-gif.gif';
import "../assets/styles/Home.css";

const QuizQuestions = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [remainingTime, setRemainingTime] = useState(15 * 60);
  const navigate = useNavigate();
  const questionContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const respQuestions = localStorage.getItem('Questions');
    if (respQuestions) {
      setQuestions(JSON.parse(respQuestions));
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (remainingTime <= 0) {
      handleFinishQuiz();
    }
  }, [remainingTime]);

  const handleChange = (e: any) => {
    const questionId = questions[currentQuestionIndex].id.toString();
    const newValue = e.target.value;
    setUserAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: newValue }));
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const handleFinishQuiz = () => {
    const payload = Object.keys(userAnswers).map((questionId) => ({
      question_id: parseInt(questionId),
      option_id: parseInt(userAnswers[questionId]),
    }));
    const payloadString = JSON.stringify({ answers: payload });
    localStorage.setItem('answers', payloadString);
    console.log('User Answers:', payload);
    navigate('/Result');
  };

  if (!questions || questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const questionId = currentQuestion.id.toString();
  const userAnswer = userAnswers[questionId] || '';

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  const scrollToQuestion = () => {
    if (questionContainerRef.current) {
      questionContainerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <nav className="fixed-navbar">
        <Link to="/Home">
          <img src={logo} className="nav--icon" alt="Learn Now Logo" />
        </Link>
        <h3 className="nav--logo_text">LEARN NOW</h3>
        <div style={{ marginTop: '1%', textAlign: 'right' }}>
          {`Time Remaining: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}
        </div>
      </nav>
      <div>
        <div style={{ display: 'flex', marginTop: '5%' }}>
          <div className="sidebar">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`sidebar-item ${index === currentQuestionIndex ? 'active' : ''} ${userAnswers[questions[index].id] ? 'answered' : ''}`}
                onClick={() => {
                  setCurrentQuestionIndex(index);
                  scrollToQuestion();
                }}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <div
            ref={questionContainerRef}
            style={{ marginTop: '5%', marginLeft: '5%', minHeight: '400px', display: 'flex', flexDirection: 'column' }}
          >
            <FormControl>
              <FormLabel>
                <Typography style={{ color: 'black', fontWeight: 700, fontSize: '20px' }}>{`Question ${currentQuestionIndex + 1}: ${currentQuestion.que}`}</Typography>
              </FormLabel>
              <RadioGroup name={`question-${questionId}`} value={userAnswer}>
                {currentQuestion.choices?.map((choice: any, index: any) => (
                  <FormControlLabel style={{ marginLeft: '12%', fontSize: '15px' }}
                    key={choice.id}
                    value={choice.id.toString()}
                    control={<Radio data-testid={`mcq-${index}`} />}
                    label={choice.option}
                    onChange={(e) => handleChange(e)}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <div style={{ position: 'absolute', bottom: '10px', left: 70, right: 10, display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
              {currentQuestionIndex > 0 && (
                <Button variant="contained" color="primary" onClick={handlePreviousQuestion}>
                  Previous
                </Button>
              )}
              {currentQuestionIndex < questions.length - 1 ? (
                <Button variant="contained" color="primary" onClick={handleNextQuestion}>
                  Next
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleFinishQuiz}>
                  Finish Quiz
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestions;
