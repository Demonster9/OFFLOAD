import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./Onboarding.css";

import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";
import { FaGithub } from "react-icons/fa";

const steps = [
    {
        key: "level",
        title: "What's your experience level?",
        options: [
            { value: "junior", label: "Junior Developer" },
            { value: "mid", label: "Mid-Level Developer" },
            { value: "senior", label: "Senior Developer" },
            { value: "staff", label: "Staff / Lead Engineer" }
        ]
    },
    {
        key: "stack",
        title: "Choose your primary stack",
        options: [
            { value: "frontend", label: "Frontend" },
            { value: "backend", label: "Backend" },
            { value: "fullstack", label: "Full Stack" },
            { value: "devops", label: "DevOps / Cloud" },
            { value: "mobile", label: "Mobile Development" }
        ]
    },
    {
        key: "intent",
        title: "Why are you joining OFFLOAD today?",
        options: [
            { value: "vent", label: "Share ideas" },
            { value: "listen", label: "Learn from others" },
            { value: "both", label: "Both" }
        ]
    }
];

export default function Onboarding() {

    const navigate = useNavigate();

    const { register } = useAuth();

    const [step, setStep] = useState(0);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [oauthMode, setOauthMode] = useState(false);

    const [answers, setAnswers] = useState({
        level: "",
        stack: "",
        intent: ""
    });

    useEffect(() => {

        const params = new URLSearchParams(window.location.search);

        const token = params.get("token");

        const onboarding = params.get("onboarding");

        const authError = params.get("error");

        if (authError) {

            setError("GitHub authentication failed.");

            window.history.replaceState({}, "", "/");

            return;

        }

        if (token) {

            localStorage.setItem("offload_token", token);

            window.history.replaceState({}, "", "/");

            if (onboarding === "true") {

    setOauthMode(true);

} else {

    navigate("/home");

}

        }

    }, [navigate]);

    const currentStep = steps[step];

    const selectedValue = answers[currentStep.key];

    const isLastStep = step === steps.length - 1;

    const selectOption = (value) => {

        setAnswers({
            ...answers,
            [currentStep.key]: value
        });

    };

    const handleContinue = async () => {

        if (!selectedValue) return;

        if (!isLastStep) {

            setStep(step + 1);

            return;

        }

        setLoading(true);

        setError("");

        try {

            if (oauthMode) {

                await authService.updateOnboarding({
                    level: answers.level,
                    stack: answers.stack,
                    intent: answers.intent
                });

            } else {

                await register({
                    level: answers.level,
                    stack: answers.stack,
                    intent: answers.intent
                });

            }

            navigate("/home");

        } catch (err) {

            console.error(err);

            setLoading(false);

            setError("Unable to continue. Please try again.");

        }

    };

        return (

        <div className="onboarding-page">

            <div className="onboarding-card">

                <div className="brand">

                    <h1>OFFLOAD</h1>

                    <p>
                        Anonymous Collaboration for Developers
                    </p>

                </div>

                {step === 0 && !oauthMode && (

                    <>

                        <a
    className="github-button"
    href={`${process.env.REACT_APP_API_URL}/api/auth/github`}
>
    <FaGithub size={22} /> 

    <span>Continue with GitHub</span>
</a>

                        <div className="divider">

                            <span>or stay anonymous</span>

                        </div>

                    </>

                )}

                <div className="step-indicator">

                    {

                        oauthMode

                            ? "Complete your profile"

                            : `Step ${step + 1} of ${steps.length}`

                    }

                </div>

                <h2 className="question">

                    {currentStep.title}

                </h2>

                <div className="options">

                    {

                        currentStep.options.map((option) => (

                            <button

                                key={option.value}

                                className={

                                    selectedValue === option.value

                                        ? "option selected"

                                        : "option"

                                }

                                onClick={() => selectOption(option.value)}

                            >

                                <span className="radio">

                                    {

                                        selectedValue === option.value

                                            ? "●"

                                            : "○"

                                    }

                                </span>

                                <span>

                                    {option.label}

                                </span>

                            </button>

                        ))

                    }

                </div>

                <div className="progress">

                    {

                        steps.map((_, index) => (

                            <div

                                key={index}

                                className={

                                    index <= step

                                        ? "progress-dot active"

                                        : "progress-dot"

                                }

                            />

                        ))

                    }

                </div>

                <button

                    className="continue-button"

                    disabled={!selectedValue || loading}

                    onClick={handleContinue}

                >

                    {

                        loading

                            ? "Setting up..."

                            : isLastStep

                                ? "Enter OFFLOAD"

                                : "Continue"

                    }

                </button>

                {

                    error && (

                        <div className="error-message">

                            {error}

                        </div>

                    )

                }

            </div>

        </div>

    );

}