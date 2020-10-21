
import { StyleSheet} from "react-native";

export const BACKGROUND_COLOR = "#EBEBEC" //blanc cassé

export const BACKGROUND_LIGHT = "#F9F9F1" //blanc

export const GENERAL_COLOR = "#7E78d2" // voilet

export const TEXT_COLOR = "#0C0C0C" // gris-noir

export const generalStyle = StyleSheet.create({
  contentMiddle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BACKGROUND_COLOR,
	},
	primaryColor: {
    backgroundColor: BACKGROUND_LIGHT,
    color: GENERAL_COLOR
  }
});