import { Link } from "react-router-dom";
import { useState } from "react";
import styled, { keyframes } from "styled-components";
import logoImage from "./logo.jpeg";
import BackgroundImage from "./back.png";
import { MdOutlineMail, MdPassword, MdPhone, MdDriveFileRenameOutline } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { BsCalendarDate } from "react-icons/bs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

/* ---------------- Styled Components ---------------- */

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url(${BackgroundImage});
  background-size: cover;
  background-position: center;
`;

const hueRotate = keyframes`
  100% {
    filter: hue-rotate(360deg);
  }
`;

const Wrapper = styled.div`
  position: relative;
  width: 500px;
  background: rgba(0, 0, 0, 0.85);
  box-shadow: 0 0 50px #0ef;
  border-radius: 20px;
  padding: 40px;
  border: 4px solid #0ef;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    animation: ${hueRotate} 1s linear infinite;
  }
`;

const LogoContainer = styled.div`
  position: absolute;
  top: -70px;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 10px #0ef;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Heading = styled.h2`
  font-size: 28px;
  color: #fff;
  margin-top: 100px;
  text-align: center;
`;

const InputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const InputGroup = styled.div`
  position: relative;
  margin: 15px 0;
  border-bottom: 2px solid #fff;
  flex: 0 0 48%;

  input {
    width: 100%;
    height: 40px;
    font-size: 15px;
    color: #fff;
    padding-left: 35px;
    background: transparent;
    border: none;
    outline: none;
  }

  svg {
    position: absolute;
    top: 10px;
    left: 0;
    color: #fff;
  }
`;

const GenderGroup = styled.div`
  width: 100%;
  margin-top: 15px;
  color: #fff;

  div {
    margin-top: 5px;
    display: flex;
    gap: 15px;
  }
`;

const Button = styled.button`
  width: 100%;
  height: 40px;
  margin-top: 20px;
  background: #0ef;
  color: #000;
  border-radius: 30px;
  border: none;
  cursor: pointer;
`;

const SignInLink = styled.div`
  margin-top: 10px;
  text-align: center;
  font-size: 14px;

  a {
    color: #0ef;
    text-decoration: none;
  }
`;

/* ---------------- Component ---------------- */

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
    mobile: "",
    dob: "",
    gender: "",
  });

  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to create account");
      }

      return result;
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <PageWrapper>
      <Wrapper>
        <LogoContainer>
          <img src={logoImage} alt="Logo" />
        </LogoContainer>

        <form onSubmit={handleSubmit}>
          <Heading>Join today</Heading>

          <InputContainer>
            <InputGroup>
              <MdOutlineMail />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            </InputGroup>

            <InputGroup>
              <FaUser />
              <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
            </InputGroup>

            <InputGroup>
              <MdDriveFileRenameOutline />
              <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
            </InputGroup>

            <InputGroup>
              <MdPassword />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            </InputGroup>

            <InputGroup>
              <MdPhone />
              <input type="tel" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} required />
            </InputGroup>

            <InputGroup>
              <BsCalendarDate />
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
            </InputGroup>
          </InputContainer>

          <GenderGroup>
            <label>Gender:</label>
            <div>
              <label>
                <input type="radio" name="gender" value="male" checked={formData.gender === "male"} onChange={handleChange} required /> Male
              </label>
              <label>
                <input type="radio" name="gender" value="female" checked={formData.gender === "female"} onChange={handleChange} required /> Female
              </label>
              <label>
                <input type="radio" name="gender" value="other" checked={formData.gender === "other"} onChange={handleChange} required /> Other
              </label>
            </div>
          </GenderGroup>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating Account..." : "Sign Up"}
          </Button>

          {isError && <p style={{ color: "red" }}>{error.message}</p>}

          <SignInLink>
            Already have an account? <Link to="/login">Sign in</Link>
          </SignInLink>
        </form>
      </Wrapper>
    </PageWrapper>
  );
};

export default SignUpPage;