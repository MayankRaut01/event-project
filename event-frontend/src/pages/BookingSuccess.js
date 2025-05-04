// pages/BookingSuccess.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';

const BookingSuccess = () => {
  return (
    <Container className="mt-5">
      <Card className="text-center">
        <Card.Body>
          <Card.Title>🎉 Booking Successful!</Card.Title>
          <Card.Text>
            Your seat has been successfully booked for the event.
          </Card.Text>
          <Button as={Link} to="/events" variant="primary">
            Browse More Events
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BookingSuccess;
