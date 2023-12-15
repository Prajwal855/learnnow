import { useEffect, useState } from 'react';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Button } from '@mui/material';
import backgroundimageoflandingpage from "../assets/images/paper-1074131_1280.jpg";
import { useNavigate } from 'react-router-dom';

const QuizQuestions = () => {
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
    const [remainingTime, setRemainingTime] = useState(30 * 60); // 30 minutes in seconds
    const navigate = useNavigate();

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

    return (
        <div className="App">
            <div>
            <div style={{ textAlign: 'right' }}>{`Time Remaining: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}</div>
                <FormControl>
                    <FormLabel>{`Question ${currentQuestionIndex + 1}: ${currentQuestion.que}`}</FormLabel>
                    <RadioGroup name={`question-${questionId}`} value={userAnswer}>
                        {currentQuestion.choices?.map((choice: any, index: any) => (
                            <FormControlLabel
                                key={choice.id}
                                value={choice.id.toString()}
                                control={<Radio data-testid={`mcq-${index}`} />}
                                label={choice.option}
                                onChange={(e) => handleChange(e)}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
            </div>
            <div style={{ marginTop: '15%', position: 'static' }}>
                {currentQuestionIndex > 0 && (
                    <Button variant="contained" color="primary" onClick={handlePreviousQuestion}>
                        Previous
                    </Button>
                )}
                {currentQuestionIndex < questions.length - 1 ? (
                    <Button style={{ marginLeft: '2%' }} variant="contained" color="primary" onClick={handleNextQuestion}>
                        Next
                    </Button>
                ) : (
                    <Button style={{ marginLeft: '2%' }} variant="contained" color="primary" onClick={handleFinishQuiz}>
                        Finish Quiz
                    </Button>
                )}
            </div>
        </div>
    );
};

export default QuizQuestions;
