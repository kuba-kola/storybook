import {
  GREETING_STEP,
  BOOKING_CONFIRMATION_STEP,
  DECISION_TREES_INTRO_STEP,
  DECISION_TREE_STEP,
  DECISION_TREE_DESCRIPTION_STEP,
  ADDITIONAL_NOTES_STEP,
  ADDITIONAL_SERVICES_STEP,
  AVAILABLE_RECALLS_STEP,
  BOOKING_SUMMARY_STEP,
  SIGNATURE_STEP,
  FINAL_STEP,
  ERROR_STEP,
} from "shared/constants/checkin-steps";

import GreetingStep from "./GreetingStep";
import BookingConfirmationStep from "./BookingConfirmationStep";
import BookingConfirmationStepInput from "./BookingConfirmationStep/Input";
import DecisionTreesIntroStep from "./DecisionTreesIntroStep";
import DecisionTreeStep from "./DecisionTreeStep";
import DecisionTreeStepInput from "./DecisionTreeStep/Input";
import DecisionTreeDescriptionStep from "./DecisionTreeDescriptionStep";
import DecisionTreeDescriptionStepInput from "./DecisionTreeDescriptionStep/Input";
import AdditionaNotesStep from "./AdditionalNotesStep";
import AdditionalNotesStepInput from "./AdditionalNotesStep/Input";
import AdditionalServicesStep from "./AdditionalServicesStep";
import AdditionalServicesStepInput from "./AdditionalServicesStep/Input";
import AvailableRecallsStep from "./AvailableRecallsStep";
import AvailableRecallsStepInput from "./AvailableRecallsStep/Input";
import BookingSummaryStep from "./BookingSummaryStep";
import BookingSummaryStepInput from "./BookingSummaryStep/Input";
import SignatureStep from "./SignatureStep";
import SignatureStepInput from "./SignatureStep/Input";
import FinalStep from "./FinalStep";
import FinalStepInput from "./FinalStep/Input";
import ErrorStep from "./ErrorStep";
import ErrorStepInput from "./ErrorStep/Input";

const STEPS = {
  [GREETING_STEP]: {
    step: GreetingStep,
    progress: 0,
  },
  [BOOKING_CONFIRMATION_STEP]: {
    step: BookingConfirmationStep,
    input: BookingConfirmationStepInput,
    progress: 0,
  },
  [DECISION_TREES_INTRO_STEP]: {
    step: DecisionTreesIntroStep,
    progress: 1,
  },
  [DECISION_TREE_STEP]: {
    step: DecisionTreeStep,
    input: DecisionTreeStepInput,
    progress: 1,
  },
  [DECISION_TREE_DESCRIPTION_STEP]: {
    step: DecisionTreeDescriptionStep,
    input: DecisionTreeDescriptionStepInput,
    progress: 1,
  },
  [ADDITIONAL_NOTES_STEP]: {
    step: AdditionaNotesStep,
    input: AdditionalNotesStepInput,
    progress: 2,
  },
  [ADDITIONAL_SERVICES_STEP]: {
    step: AdditionalServicesStep,
    input: AdditionalServicesStepInput,
    progress: 3,
  },
  [AVAILABLE_RECALLS_STEP]: {
    step: AvailableRecallsStep,
    input: AvailableRecallsStepInput,
    progress: 4,
  },
  [BOOKING_SUMMARY_STEP]: {
    step: BookingSummaryStep,
    input: BookingSummaryStepInput,
    progress: 5,
  },
  [SIGNATURE_STEP]: {
    step: SignatureStep,
    input: SignatureStepInput,
    progress: 6,
  },
  [FINAL_STEP]: {
    step: FinalStep,
    input: FinalStepInput,
    progress: 7,
  },
  [ERROR_STEP]: {
    step: ErrorStep,
    input: ErrorStepInput,
    progress: 7,
  },
};

export const MAX_PROGRESS = Math.max(...Object.values(STEPS).map((step) => step.progress));

export default STEPS;
