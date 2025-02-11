import { Link } from "react-router-dom";
import { useState } from "react";
import styled, { keyframes } from "styled-components";
import logoImage from "./logo.jpeg";
import BackgroundImage from "./back.png";
import { MdOutlineMail, MdPassword, MdPhone } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { BsCalendarDate } from "react-icons/bs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

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
  width: 500px;
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

const InputContainer = styled.div`
  display: flex;
  flex-wrap: wrap; /* Allows inputs to wrap into rows */
  justify-content: space-between; /* Space out the input fields */
  width: 100%;
`;

const InputGroup = styled.div`
  position: relative;
  margin: 15px 0;
  border-bottom: 2px solid #fff;
  flex: 0 0 48%; /* Each input takes up about 48% of the width */

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
    width: 100%;
    height: 40px;
    font-size: 16px;
    color: #fff; // Change text color to white
    padding: 0 5px 0 50px;
    background: transparent; // Keep background transparent for styling
    border: none; // No border to maintain transparency
    outline: none;

    &:focus ~ label,
    &:valid ~ label {
      top: -5px;
    }

    // Adding a style for the date input button (calendar icon)
    &::-webkit-calendar-picker-indicator {
      color: #fff; // Change the color of the calendar button to white
    }
  }

  svg {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    font-size: 20px;
    color: #fff;
  }
`;

const GenderGroup = styled.div`
  flex: 0 0 100%; /* Make the gender selection span the full width */
  margin-top: 15px;

  label {
    color: #fff;
    margin-right: 10px;
  }

  div {
    display: flex;
    justify-content: flex-start;
    margin-top: 5px;

    label {
      margin-right: 15px; /* Space between radio options */
      color: #fff; /* Color for the radio option labels */
    }
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

const SignInLink = styled.div`
  font-size: 14px;
  text-align: center;
  margin: -8px 0;

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

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
    mobile: "",
    dob: "",
    gender: "", // Added gender field
  });

  const queryClient = useQueryClient();

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ email, username, fullName, password, mobile, dob, gender }) => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, username, fullName, password, mobile, dob, gender }), // Include gender
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create account");
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <PageWrapper>
      <Wrapper>
        <LogoContainer>
          <img src={logoImage} alt="Company Logo" />
        </LogoContainer>
        <FormWrapper>
          <form onSubmit={handleSubmit}>
            <Heading>Join today.</Heading>
            <InputContainer>
              <InputGroup>
                <MdOutlineMail />
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  onChange={handleInputChange}
                  value={formData.email}
                  required
                />
                <label></label>
              </InputGroup>
              <InputGroup>
                <FaUser />
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  onChange={handleInputChange}
                  value={formData.username}
                  required
                />
                <label></label>
              </InputGroup>
              <InputGroup>
                <MdDriveFileRenameOutline />
                <input
                  type="text"
                  placeholder="Full Name"
                  name="fullName"
                  onChange={handleInputChange}
                  value={formData.fullName}
                  required
                />
                <label></label>
              </InputGroup>
              <InputGroup>
                <MdPassword />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleInputChange}
                  value={formData.password}
                  required
                />
                <label></label>
              </InputGroup>
              <InputGroup>
                <MdPhone />
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  name="mobile"
                  onChange={handleInputChange}
                  value={formData.mobile}
                  required
                />
                <label></label>
              </InputGroup>
              <InputGroup>
                <BsCalendarDate />
                <input
                  type="date"
                  name="dob"
                  onChange={handleInputChange}
                  value={formData.dob}
                  required
                />
                <label></label>
              </InputGroup>
            </InputContainer>

            {/* Gender Selection without input line */}
            <GenderGroup>
              <label>Gender:</label>
              <div>
                <label>
                  <input
                    type="radio"
                    value="male"
                    name="gender"
                    checked={formData.gender === "male"}
                    onChange={handleInputChange}
                    required
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    value="female"
                    name="gender"
                    checked={formData.gender === "female"}
                    onChange={handleInputChange}
                    required
                  />
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    value="other"
                    name="gender"
                    checked={formData.gender === "other"}
                    onChange={handleInputChange}
                    required
                  />
                  Other
                </label>
              </div>
            </GenderGroup>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating Account..." : "Sign Up"}
            </Button>

            {isError && <p style={{ color: "red" }}>{error.message}</p>}

            <SignInLink>
              <p>
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </SignInLink>
          </form>
        </FormWrapper>
      </Wrapper>
    </PageWrapper>
  );
};

export default SignUpPage;