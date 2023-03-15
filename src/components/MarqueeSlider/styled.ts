import styled from "styled-components";

interface StyledProp { }

export const HighlightStyled = styled.section<StyledProp>`
  .highlight-inner {
    background: transparent;
  }
  .swiper-wrapper {
    padding: 1.5rem 0 2rem;
    background: transparent;
  }
  img {
    max-width: 100%;
    border-radius: 0.75rem;
  }
  .card {
    border-radius: 3rem;
    background-color: whitesmoke;
    border: 4px solid rgb(34 197 94);
    overflow: hidden;
    box-shadow: 0 1px 1px rgb(0 0 0 / 10%), 0 2px 2px rgb(0 0 0 / 10%),
      0 4px 4px rgb(0 0 0 / 10%), 0 8px 8px rgb(0 0 0 / 10%),
      0 16px 16px rgb(0 0 0 / 10%);
  }
`;
