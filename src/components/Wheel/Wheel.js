import React, { Fragment } from "react";
import { Caption, Wrapper, ConfettiWrapper } from "./elements";
import Confetti from "react-confetti";

export default props => (
  <Wrapper>
    <Caption>
      {props.isSpinning && (
        <span aria-label="Spinning…" role="img">
          ⁉️
        </span>
      )}

      {!props.isSpinning && (
        <Fragment>
          {props.event ? (
            <section>
              🕺 N°{props.value} 🕺
              <br />
              <small>
                <i>{props.label}</i>
              </small>
            </section>
          ) : (
            <span>Spin the wheel! 🤸‍♀️</span>
          )}

          <ConfettiWrapper>
            <Confetti {...props.size} />
          </ConfettiWrapper>
        </Fragment>
      )}
    </Caption>
  </Wrapper>
);
