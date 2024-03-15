import React, { useState } from "react";
import styled from "@emotion/styled";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
interface Quote {
  id: string;
  content: string;
}

const initial: Quote[] = Array.from({ length: 10 }, (v, k) => k).map(k => ({
  id: `id-${k}`,
  content: `Quote ${k}`
}));

const grid = 8;
const reorder = (list: Quote[], startIndex: number, endIndex: number): Quote[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const QuoteItem = styled.div`
  width: 200px;
  border: 1px solid grey;
  margin-bottom: ${grid}px;
  background-color: lightblue;
  padding: ${grid}px;
`;

const Quote: React.FC<{ quote: Quote; index: number }> = ({ quote, index }) => {
  return (
    <Draggable draggableId={quote.id} index={index}>
      {provided => (
        <QuoteItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {quote.content}
        </QuoteItem>
      )}
    </Draggable>
  );
};

const QuoteList: React.FC<{ quotes: Quote[] }> = React.memo(({ quotes }) => {
  return quotes.map((quote: Quote, index: number) => (
    <Quote quote={quote} index={index} key={quote.id} />
  ));
});

const App: React.FC = () => {
  const [state, setState] = useState<{ quotes: Quote[] }>({ quotes: initial });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const quotes = reorder(
      state.quotes,
      result.source.index,
      result.destination.index
    );

    setState({ quotes });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <QuoteList quotes={state.quotes} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default App