import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import {
  GROUP_POSITION_ACTIVE,
  GROUP_POSITION_DEFAULT,
  GROUP_ROTATION_ACTIVE,
  GROUP_ROTATION_DEFAULT,
  ITEM_GAP,
  planeSettings,
} from "./settings"

interface CarouselSettings {
  width: number
  height: number
  rotation: [number, number, number]
  position: [number, number, number]
  itemGap: number
  enableParallax: boolean
  enableFloating: boolean
}

interface CarouselContextType {
  activeIndex: number | null
  setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>
  settings: CarouselSettings
  isActive: boolean
  toggleParallax: () => void
  toggleFloating: () => void
}

const CarouselContext = createContext<CarouselContextType | null>(null)

export const useCarousel = () => {
  const context = useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a CarouselProvider")
  }
  return context
}

// NOTE: the original repo's dat.gui debug panel (initGUI / `import("dat.gui")`)
// has been removed entirely here. It's a dev-only tweaking tool the author
// used while building the effect — it was never meant to be visible to end
// users, and is what was showing up as an unwanted "settings control window"
// on top of the carousel. All the values it let you tweak live (width,
// height, rotation, item gap, parallax/floating toggles) are now just fixed
// values from settings.ts, same as before, just without the visible UI.

export const CarouselProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [settings, setSettings] = useState<CarouselSettings>({
    width: planeSettings.width,
    height: planeSettings.height,
    rotation: GROUP_ROTATION_DEFAULT,
    position: GROUP_POSITION_DEFAULT,
    itemGap: ITEM_GAP,
    enableFloating: true,
    enableParallax: true,
  })
  const isActive = activeIndex !== null

  const toggleParallax = () =>
    setSettings((prev) => ({ ...prev, enableParallax: !prev.enableParallax }))

  const toggleFloating = () =>
    setSettings((prev) => ({ ...prev, enableFloating: !prev.enableFloating }))

  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      rotation: isActive ? GROUP_ROTATION_ACTIVE : GROUP_ROTATION_DEFAULT,
      position: isActive ? GROUP_POSITION_ACTIVE : GROUP_POSITION_DEFAULT,
    }))
  }, [isActive, activeIndex])

  return (
    <CarouselContext.Provider
      value={{
        settings,
        activeIndex,
        setActiveIndex,
        isActive,
        toggleParallax,
        toggleFloating,
      }}
    >
      {children}
    </CarouselContext.Provider>
  )
}

