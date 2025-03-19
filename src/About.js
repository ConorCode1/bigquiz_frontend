import React from "react";
import "./App.css";

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>
          Unleash the power of gamified learning and ace your exams with
          confidence.
        </h1>
      </div>
      <div className="about-body">
        <p>
          Tired of sifting through endless pages of boring study notes? Discover
          a more exciting way to learn!
          <br></br>
          <br></br>
          We believe studying shouldn't feel like a chore, that's why we've
          sprinkled in some gaming magic to make it more exciting. Dive into
          interactive quizzes that make even the toughest topics feel like play.
          <br></br>
          <br></br>
          <strong>Rewards & Achievements:</strong> Earn points, badges, and even
          unlock special content as you progress. Studying has never been this
          rewarding!
          <br></br>
          <br></br>
          <strong>Collaborate & Compete:</strong> Team up with friends for group
          challenges or test your knowledge against classmates in our
          leaderboard battles.
          <br></br>
          <br></br>
          <strong>Mobile & Flexible:</strong> On the bus or in bed? No problem!
          Educade is optimized for all devices, so you can study anytime,
          anywhere.
          <br></br>
          <br></br>
          Dig deep into every subject and feel confident about acing those
          exams. Hop on board with Educade and turn study time into game time!
        </p>
        {/* Add any additional content or images here */}
      </div>
    </div>
  );
};

export default About;
