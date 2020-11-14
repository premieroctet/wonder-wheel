import React from "react"
import Particle from "particle-api-js"

const particle = new Particle()

const DEVICE_ID = process.env.REACT_APP_DEVICE_ID
const TOKEN = process.env.REACT_APP_PARTICLE_TOKEN

const useIkeaWheel = () => {
  const [isSpinning, setSpinning] = React.useState(false)
  const [value, setValue] = React.useState<string>()

  React.useEffect(() => {
    const initStream = async () => {
      const stream = await particle.getEventStream({
        deviceId: DEVICE_ID,
        auth: TOKEN,
      })

      stream.on("event", async (event: any) => {
        if (event.name === "SPINNING") {
          setSpinning(true)
        } else if (event.name === "WHEEL_VALUE") {
          setValue(event.data)
          setSpinning(false)
        }
      })
    }

    initStream()
  }, [])

  return { isSpinning, value }
}

export default useIkeaWheel
