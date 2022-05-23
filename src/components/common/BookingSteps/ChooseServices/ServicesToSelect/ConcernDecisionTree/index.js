import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import cx from "classnames";
import { authTokenSelector } from "store/selectors/auth-selectors";
import "./styles.scss";
import { SOURCE_USER } from "shared/constants/text-messages";

const ConcernDecisionTree = ({ service: { decision_tree }, decisionTreeDetails, onChange }) => {
  const [decisionTreeResult, setDecisionTreeResult] = useState({});

  useEffect(() => {
    if (decisionTreeDetails && decisionTreeDetails.length > 0) {
      const answerIndexes = decisionTreeDetails
        .map(({ source }, treeItemIndex) => (source === SOURCE_USER ? treeItemIndex : null))
        .filter((treeItem) => treeItem !== null);
      const results = answerIndexes.reduce((total, answerIndex) => ({
        ...total,
        [decisionTreeDetails[answerIndex - 1].text]: decisionTreeDetails[answerIndex].text,
      }), {});

      setDecisionTreeResult(results);
      onChange(results);
    }
  }, [decisionTreeDetails]);

  return (
    <div className="conciergeDecisionTree">
      <div className="conciergeDecisionTreeIntro">{decision_tree.intro.text}</div>
      {decision_tree.steps.map((step) => (
        <div className="conciergeDecisionTreeStep" key={step.text}>
          <div className="conciergeDecisionTreeQuestion">{step.text}</div>
          <div className="conciergeDecisionTreeAnswers">
            {(step.answers || []).map(({ text }) => (
              <button
                type="button"
                key={text}
                className={cx("conciergeSchedulingButton transportButton", {
                  transportSelected: decisionTreeResult[step.text] === text,
                })}
                onClick={() => {
                  const nextState = {
                    ...decisionTreeResult,
                    [step.text]: decisionTreeResult[step.text] === text ? null : text,
                  };
                  setDecisionTreeResult(nextState);
                  onChange(nextState);
                }}
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

ConcernDecisionTree.propTypes = {};

ConcernDecisionTree.defaultProps = {};

const mapStateToProps = (state) => ({
  token: authTokenSelector(state),
});

export default connect(mapStateToProps)(ConcernDecisionTree);
