import { Button, Card, Typography } from "@mui/material"
import { Stack } from "@mui/system"
import { useEffect, useState } from "react"

export const WordScramble = () => {
  const [word, setWord] = useState("")
  const [letters, setLetters] = useState([])
  const [droppedLetters, setDroppedLetters] = useState([])
  const [showWord, setShowWord] = useState(false)

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
  ]

  const pickAndScrambleWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length)
    const randomWord = words[randomIndex]
    const scrambled = randomWord.split("").sort(() => Math.random() - 0.5)
    if (scrambled.join("") === randomWord) {
      pickAndScrambleWord()
      return
    }
    setWord(randomWord)
    setLetters(() => scrambled.map((letter, index) => ({ letter, index })))
    setDroppedLetters(() => Array(scrambled.length).fill(null))
  }

  useEffect(() => {
    pickAndScrambleWord()
  }, [])

  const handleDrop = (e, slotIndex) => {
    e.preventDefault()
    const droppedLetter = JSON.parse(e.dataTransfer.getData("text/plain"))
    setDroppedLetters((prev) => {
      const newState = [...prev]
      if (newState[slotIndex]) {
        const removedLetter = newState[slotIndex]
        newState[removedLetter.index] = null
        setLetters((prev) => {
          const newState = [...prev]
          newState[removedLetter.index] = removedLetter
          return newState
        })
      }
      newState[slotIndex] = droppedLetter
      return newState
    })
    setLetters((prev) => {
      const newState = [...prev]
      newState[droppedLetter.index] = null
      return newState
    })
  }

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(letters[index]))
    e.dataTransfer.effectAllowed = "move"
  }

  const handleSlotClick = (index) => {
    if (!droppedLetters[index]) return
    setDroppedLetters((prev) => {
      const newState = [...prev]
      const removedLetter = newState[index]
      newState[index] = null
      setLetters((prev) => {
        const newState = [...prev]
        newState[removedLetter.index] = removedLetter
        return newState
      })
      return newState
    })
  }

  const handleLetterClick = (index) => {
    if (!letters[index]) return
    const emptySlotIndex = droppedLetters.indexOf(null)
    if (emptySlotIndex === -1) return
    setDroppedLetters((prev) => {
      const newState = [...prev]
      newState[emptySlotIndex] = letters[index]
      return newState
    })
    setLetters((prev) => {
      const newState = [...prev]
      newState[index] = null
      return newState
    })
  }

  const renderSlots = () => {
    return letters.map((_, index) => (
      <Card
        sx={{ width: "4rem", height: "4rem" }}
        key={index}
        onDrop={(e) => handleDrop(e, index)}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => handleSlotClick(index)}
      >
        <Stack justifyContent="center" alignItems="center" height="100%">
          <Typography
            textAlign="center"
            variant="h4"
            sx={{ userSelect: "none" }}
          >
            {droppedLetters[index] ? droppedLetters[index].letter : null}
          </Typography>
        </Stack>
      </Card>
    ))
  }

  const renderLetters = () => {
    return letters.map((letter, index) => (
      <Card
        sx={{ width: "4rem", height: "4rem" }}
        key={index}
        draggable={!letter ? false : true}
        onDragStart={(e) => handleDragStart(e, index)}
        onClick={() => handleLetterClick(index)}
      >
        <Stack justifyContent="center" alignItems="center" height="100%">
          <Typography
            textAlign="center"
            variant="h4"
            sx={{ userSelect: "none" }}
          >
            {letter?.letter ? letter.letter : null}
          </Typography>
        </Stack>
      </Card>
    ))
  }

  const isSolved = () => {
    const currentWord = droppedLetters.map((letter) => letter?.letter).join("")
    return currentWord === word
  }

  return (
    <Stack spacing={2} sx={{ userSelect: "none" }}>
      <Stack direction="row" spacing={2}>
        {renderSlots()}
      </Stack>
      <Stack direction="row" spacing={2}>
        {renderLetters()}
      </Stack>
      {isSolved() ? (
        <Stack>
          <Typography variant="h4" textAlign="center">
            You solved it!
          </Typography>
          <Button onClick={() => pickAndScrambleWord()} variant="contained">
            <Typography variant="h4" textAlign="center">
              Next word
            </Typography>
          </Button>
        </Stack>
      ) : (
        <Button onClick={() => setShowWord(!showWord)} variant="contained">
          {showWord ? "Hide word" : "See word"}
        </Button>
      )}
      {showWord && !isSolved() ? (
        <Stack justifyContent="center" alignItems="center" height="100%">
          {word.toUpperCase()}
        </Stack>
      ) : null}
    </Stack>
  )
}
