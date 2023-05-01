import { Button, Card, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { cpSync } from "fs";
import { useEffect, useState } from "react";

export const WordScramble = () => {
  const [word, setWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [letters, setLetters] = useState([]);
  const [droppedLetters, setDroppedLetters] = useState([]);
  const [showWord, setShowWord] = useState(false);

  // make a list of words in polish of length 4-8
  const words = [
    "serce",
    "butelka",
    "kolor",
    "szafa",
    "piłka",
    "kwiatek",
    "strona",
    "kotlet",
    "łóżko",
    "kredka",
    "zupa",
    "plecak",
    "brzuch",
    "bluza",
    "ręcznik",
    "klawisz",
    "piasek",
    "szkło",
    "rower",
    "kurtka",
  ];

  // pick a random word and scramble it
  const pickAndScrambleWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex];
    const scrambled = randomWord.split("").sort(() => Math.random() - 0.5);
    if (scrambled.join("") === randomWord) {
      pickAndScrambleWord();
      return;
    }
    setWord(randomWord);
    setScrambledWord(scrambled.join(""));
    setLetters(scrambled);
    setDroppedLetters([]);
  };

  useEffect(() => {
    pickAndScrambleWord();
  }, []);

  // event handler for dropping a letter onto a slot
  const handleDrop = (e, slotIndex) => {
    e.preventDefault();
    const droppedLetter = e.dataTransfer.getData("text");
    setDroppedLetters((prev) => {
      const newState = [...prev];
      newState[slotIndex] = droppedLetter;
      return newState;
    });
    setLetters((prev) => {
      const newState = [...prev];
      const index = newState.indexOf(droppedLetter);
      if (index > -1) {
        newState.splice(index, 1);
      }
      return newState;
    });
  };

  // event handler for dragging a letter
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", letters[index]);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleSlotClick = (index) => {
    setDroppedLetters((prev) => {
      const newState = [...prev];
      const removedLetter = newState[index];
      newState[index] = null;
      setLetters((prev) => [...prev, removedLetter]);
      return newState;
    });
  };

  // render the letter slots
  const renderSlots = () => {
    return scrambledWord.split("").map((_, index) => (
      <Card
        sx={{ width: "4rem", height: "4rem" }}
        key={index}
        onDrop={(e) => handleDrop(e, index)}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => handleSlotClick(index)}
      >
        <Stack justifyContent="center" alignItems="center" height="100%">
          <Typography textAlign="center" variant="h4">
            {droppedLetters[index] || ""}
          </Typography>
        </Stack>
      </Card>
    ));
  };

  // render the letter buttons
  const renderButtons = () => {
    return letters.map((letter, index) => (
      <Card
        sx={{ width: "4rem", height: "4rem" }}
        key={index}
        draggable
        onDragStart={(e) => handleDragStart(e, index)}
      >
        <Stack justifyContent="center" alignItems="center" height="100%">
          <Typography textAlign="center" variant="h4">
            {letter}
          </Typography>
        </Stack>
      </Card>
    ));
  };

  // check if the word is correctly solved
  const isSolved = () => {
    const currentWord = droppedLetters.join("");
    return currentWord === word;
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        {renderSlots()}
      </Stack>
      <Stack direction="row" spacing={2}>
        {renderButtons()}
      </Stack>
      {isSolved() ? (
        <Stack>
          <Typography variant="h4" textAlign="center">
            You solved it!
          </Typography>
          <Button onClick={() => pickAndScrambleWord()}>
            <Typography variant="h4" textAlign="center">
              Next word
            </Typography>
          </Button>
        </Stack>
      ) : (
        <Button onClick={() => setShowWord(!showWord)}>
          {showWord ? "Hide word" : "See word"}
        </Button>
      )}
      {showWord ? (
        <Stack justifyContent="center" alignItems="center" height="100%">
          <Typography textAlign="center" variant="h4">
            {word.toUpperCase()}
          </Typography>
        </Stack>
      ) : null}
    </Stack>
  );
};
