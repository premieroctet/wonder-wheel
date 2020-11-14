import React from "react"
import { Box, Center, VStack } from "@chakra-ui/react"
import Confetti from "react-confetti"
import "./assets/index.css"
import "animate.css"
import useIkeaWheel from "./hooks/useIkeaWheel"

const SHEET_ID = process.env.REACT_APP_SHEET_ID
const GOOGLE_SHEET_TOKEN = process.env.REACT_APP_GOOGLE_SHEET_TOKEN

const App = () => {
  const { isSpinning, value } = useIkeaWheel()
  const [isLoading, setLoading] = React.useState(false)
  const [label, setLabel] = React.useState(null)

  const loadLabels = async () => {
    const data = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/friends!a1:a26?key=${GOOGLE_SHEET_TOKEN}`
    ).then((res) => res.json())

    return data.values
  }

  React.useEffect(() => {
    const fetchLabel = async () => {
      if (value) {
        setLoading(true)
        const values = await loadLabels()
        const index = parseInt(value) - 1
        setLabel(values[index] || "-")
        setLoading(false)
      }
    }

    fetchLabel()
  }, [value])

  return (
    <Box color="white" height="100vh" width="100vw">
      <Center
        fontFamily="Fredoka One"
        height="100%"
        backgroundColor="yellow.300"
      >
        {(isSpinning || isLoading) && (
          <Box
            className="animate__animated animate__repeat-2 animate__tada"
            fontSize="10rem"
            aria-label="Spinning…"
            role="img"
          >
            🤔
          </Box>
        )}

        {!isSpinning && !isLoading && (
          <>
            {label ? (
              <VStack spacing={-10}>
                <Box fontWeight="bold" fontSize="6rem">
                  N°{value} 🕺
                </Box>
                <Box color="yellow.700" fontSize="10rem">
                  {label}
                  <Confetti />
                </Box>
              </VStack>
            ) : (
              <Box
                color="yellow.700"
                className="animate__animated animate__tada"
                fontSize="6rem"
              >
                Spin the wheel! 🤸‍♀️
              </Box>
            )}
          </>
        )}
      </Center>
    </Box>
  )
}

export default App
