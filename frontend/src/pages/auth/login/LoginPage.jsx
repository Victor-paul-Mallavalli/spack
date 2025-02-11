import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoImage from "./logo.jpeg"; // Ensure this import is correct
import BackgroundImage from "./back.png"; // Ensure this import is correct
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import styled, { keyframes } from "styled-components";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  min-width: 100vw;
  background-image: url(${BackgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  overflow: hidden;
  margin: 0;
  padding: 0;
`;

const Wrapper = styled.div`
  position: relative;
  width: 400px;
  height: auto;
  left: 350px;
  bottom: -50px;
  background: rgba(0, 0, 0, 0.8);
  box-shadow: 0 0 50px #0ef;
  border-radius: 20px;
  padding: 40px;
  border: 5px solid #0ef;
  display: flex;
  flex-direction: column;
  align-items: center;
  &:hover {
    animation: ${keyframes`
      100% {
        filter: hue-rotate(360deg);
      }
    `} 1s linear infinite;
  }
`;

const LogoContainer = styled.div`
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
  width: 220px;
  height: 200px;
  background: #000;
  border: 1px solid #0ef;
  display: flex;
  justify-content: center;
  margin: -30px auto 20px;
  align-items: center;
  box-shadow: 0 0 10px #0ef;

  img {
    border-radius: 50%;
    width: 90%;
    height: 90%;
    object-fit: cover;
  }
`;

const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  transition: 1s ease-in-out;
`;

const Heading = styled.h2`
  font-size: 30px;
  color: #fff;
  text-align: center;
`;

const InputGroup = styled.div`
  position: relative;
  margin: 30px 0;
  border-bottom: 2px solid #fff;

  label {
    position: absolute;
    top: 50%;
    left: 5px;
    transform: translateY(-50%);
    font-size: 16px;
    color: #fff;
    pointer-events: none;
    transition: 0.5s;
  }

  input {
    width: 320px;
    height: 40px;
    font-size: 16px;
    color: #fff;
    padding: 0 5px 0 50px;
    background: transparent;
    border: none;
    outline: none;

    &:focus ~ label,
    &:valid ~ label {
      top: -5px;
    }
  }

  svg {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    color: #fff;
    font-size: 20px;
    margin-left: 5px;
  }

  .toggle-password {
    position: absolute;
    right: 27px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #fff;
  }
`;

const Button = styled.button`
  width: 100%;
  height: 40px;
  background: #0ef;
  box-shadow: 0 0 10px #0ef;
  font-size: 16px;
  color: #000;
  font-weight: 500;
  cursor: pointer;
  border-radius: 30px;
  border: none;
  outline: none;

  &:hover {
    background: #00e5ff;
    box-shadow: 0 0 20px #00e5ff;
  }
`;

const SignUpLink = styled.div`
  font-size: 14px;
  text-align: center;
  margin: 15px 0;
  p {
    color: #fff;
    a {
      color: #0ef;
      text-decoration: none;
      font-weight: 500;
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const SocialLoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const SocialLoginButton = styled.button`
  width: 50px;
  height: 50px;
  background: #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 10px;
  border: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transition: 0.4s;

  svg {
    font-size: 28px;
  }

  &:hover {
    background-color: #f0f0f0;
  }
`;

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: loginMutation, isPending, isError, error } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error.message || "An error occurred");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleGoogleSignIn = () => {
    toast.success("Signing in with Google...");
  };

  const handleFacebookSignIn = () => {
    toast.success("Signing in with Facebook...");
  };

  const handleAppleSignIn = () => {
    toast.success("Signing in with Apple...");
  };

  return (
    <PageWrapper>
      <Wrapper>
        <LogoContainer>
          <img src={logoImage} alt="Company Logo" />
        </LogoContainer>
        <FormWrapper>
          <form onSubmit={handleSubmit}>
            <Heading>Let's go.</Heading>

            <InputGroup>
              <MdOutlineMail />
              <input
                type="text"
                placeholder="username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
              />
              <label></label>
            </InputGroup>

            <InputGroup>
              <MdPassword />
              <input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Password"
                name="password"
                onChange={handleInputChange}
                value={formData.password}
              />
              <label></label>
              <span
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                {isPasswordVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </InputGroup>

            <Button type="submit">
              {isPending ? "Loading..." : "Login"}
            </Button>
            {isError && <p style={{ color: "red" }}>{error.message}</p>}
          </form>
        </FormWrapper>

        <SocialLoginWrapper>
          <SocialLoginButton onClick={handleGoogleSignIn}>
            <FcGoogle />
          </SocialLoginButton>

          <SocialLoginButton onClick={handleFacebookSignIn}>
            <FaFacebook style={{ color: "#031dfc" }} />
          </SocialLoginButton>

          <SocialLoginButton onClick={handleAppleSignIn}>
            <FaApple />
          </SocialLoginButton>
        </SocialLoginWrapper>

        <SignUpLink>
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </SignUpLink>
      </Wrapper>
    </PageWrapper>
  );
};

export default LoginPage;