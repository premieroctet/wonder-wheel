import React from "react"
import { Box, Center, VStack } from "@chakra-ui/react"
import Particle from "particle-api-js"
import Confetti from "react-confetti"
import "./assets/index.css"
import "animate.css"

const particle = new Particle()

const DEVICE_ID = process.env.REACT_APP_DEVICE_ID
const TOKEN = process.env.REACT_APP_PARTICLE_TOKEN
const SHEET_ID = process.env.REACT_APP_SHEET_ID
const GOOGLE_SHEET_TOKEN = process.env.REACT_APP_GOOGLE_SHEET_TOKEN

const App = () => {
  const [isSpinning, setisSpinning] = React.useState(false)
  const [label, setLabel] = React.useState(null)
  const [value, setValue] = React.useState(null)

  const loadLabels = async () => {
    const data = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/friends!a1:a26?key=${GOOGLE_SHEET_TOKEN}`
    ).then((res) => res.json())

    return data.values
  }

  React.useEffect(() => {
    const initStream = async () => {
      const stream = await particle.getEventStream({
        deviceId: DEVICE_ID,
        auth: TOKEN,
      })

      stream.on("event", async (event: any) => {
        if (event.name === "SPINNING") {
          setisSpinning(true)
        } else if (event.name === "WHEEL_VALUE") {
          const values = await loadLabels()
          const index = parseInt(event.data) - 1

          setisSpinning(false)
          setValue(event.data)
          setLabel(values[index] || "-")
        }
      })
    }

    initStream()
  }, [])

  return (
    <Box color="white" height="100vh" width="100vw">
      <Center
        fontFamily="Fredoka One"
        height="100%"
        backgroundColor="yellow.300"
      >
        {isSpinning && (
          <Box
            className="animate__animated animate__repeat-2 animate__tada"
            fontSize="10rem"
            aria-label="Spinning…"
            role="img"
          >
            🤔
          </Box>
        )}

        {!isSpinning && (
          <>
            {label ? (
              <VStack spacing={-10}>
                <Box fontWeight="bold" fontSize="6rem">
                  N°{value} 🕺
                </Box>
                <Box color="yellow.800" fontSize="10rem">
                  {label}
                  <Confetti />
                </Box>
              </VStack>
            ) : (
              <Box className="animate__animated animate__tada" fontSize="6rem">
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
