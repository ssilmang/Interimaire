<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Address;
class AlertKangourou extends Mailable
{
    use Queueable, SerializesModels;
    public $interim ;
    public $contrat ;
    /**
     * Create a new message instance.
     */
    public function __construct($interim,$contrat)
    {
        $this->interim = $interim;
        $this->contrat = $contrat;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
          from:new Address('sarrpc1@gmail.com','Gestion des Interimaires'),
          replyTo: [
                new Address("sarrpc1@gmail.com",'Gestion des Intérimaires')
          ],
          subject:"Processus de Kangourou",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'kangourou',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
