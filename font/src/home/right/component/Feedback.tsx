import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

const FeedbackComponent: React.FC = () => {
  const [feedback, setFeedback] = useState("");

  const handleFeedbackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeedback(event.target.value);
  };

  const handleSubmit = () => {
    if (feedback.trim()) {
      alert(`Feedback submitted ✅✅\n\nYour feedback: "${feedback}"`);
      setFeedback(""); // Clear the input field after submission
    } else {
      alert("⚠️ Please provide your feedback before submitting!");
    }
  };

  return (
    <Box p={2} sx={{ maxWidth: '100%', margin: "0 auto" }}>
      <Typography variant="h6" gutterBottom>
        Any Feature you would like? 💬
      </Typography>
      <Typography variant="body2" gutterBottom>
        We are committed to providing you with the best experience sniping tokens on Solana.
      </Typography>
      <Typography variant="body2" gutterBottom>
        Let us know which new feature you would like to have, and we will work on it ASAP!
      </Typography>
      {/* Feedback Input */}
      <TextField
        label="Leave your suggestion"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={feedback}
        onChange={handleFeedbackChange}
        sx={{ mt: 2, mb: 2 }}
      />
      {/* Submit Button */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
        sx={{ textTransform: "none" }}
      >
        Submit Feedback
      </Button>
    </Box>
  );
};

export default FeedbackComponent;
