import React from 'react';
import './Feedback.css';

const testimonials = [
  {
    id: 1,
    name: 'ABHI.',
    feedback: 'Adopting Buddy was the best decision we ever made! The process was so smooth, and the staff were incredibly helpful. He has brought so much joy into our home.',
  },
  {
    id: 2,
    name: 'Rohit.',
    feedback: 'I was so impressed with how much they care for the animals. Finding Luna was a dream come true. She is the sweetest cat and has settled in perfectly.',
  },
  {
    id: 3,
    name: 'NIRU',
    feedback: 'We are so grateful to PetAdopt for helping us find our furry friend, Rocky. The adoption process was straightforward and the team was very supportive.',
  },
  {
    id: 4,
    name: 'SHALS.',
    feedback: 'The volunteers are amazing and truly passionate about what they do. They helped me find the perfect companion in Daisy. Highly recommend them!',
  },
    {
    id: 5,
    name: 'RAKESH.',
    feedback: 'A wonderful experience from start to finish. Our new puppy, Max, is healthy, happy, and has already become a beloved member of our family.',
  }
];

const Feedback = () => {
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="feedback-section">
      <h2 className="feedback-title">Happy Tails from Our Adopters</h2>
      <div className="feedback-container">
        <div className="feedback-scroller">
          {duplicatedTestimonials.map((testimonial, index) => (
            <div className="feedback-card" key={index}>
              <p className="feedback-text">"{testimonial.feedback}"</p>
              <div className="adopter-info">
                <span className="adopter-name">- {testimonial.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feedback;