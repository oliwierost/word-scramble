import React from "react";
import styled from "styled-components";

const HeaderContainer = styled.div`
  font-family: "Ubuntu", sans-serif;
  font-size: 5rem;
`;

export default function Header() {
  const tmp = [1, 2, 3];
  return (
    <HeaderContainer>
      hello
      <div>
        {tmp.map((item) => (
          <div>{item}</div>
        ))}
      </div>
    </HeaderContainer>
  );
}
