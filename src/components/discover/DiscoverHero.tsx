import { useEffect, useRef, useState, useCallback } from 'react';
import bookCover from '@/assets/book-cover.png';

const PAGES = [
  {
    eyebrow: 'Title Page',
    title: 'GTM for Professional Services',
    subtitle:
      'The Relationship Revenue OS — Not a plan for entering a new market.\nA system for activating the one you already own.',
    content: (
      <>
        <p>
          <strong>Adam Fridman · Richard Ashbaugh</strong>
        </p>
        <p className="dh-meta">Mabbly · Chicago, Illinois</p>
        <p className="dh-legal">
          First Edition. All rights reserved. No part of this publication may be reproduced
          without written permission of the publisher. For permissions, contact Mabbly.
        </p>
      </>
    ),
  },
  {
    eyebrow: 'Contents',
    title: 'Table of Contents',
    subtitle: null,
    content: (
      <ul className="dh-toc">
        {[
          ['Intro', 'Why Your Next Client Is Already Waiting', '7'],
          ['Ch. 1', 'The Dead Zone: Where Revenue Disappears', '19'],
          ['Ch. 2', 'Five Orbits: The Relationship Map', '41'],
          ['Ch. 3', 'Signals: Reading the Room at Scale', '67'],
          ['Ch. 4', 'The Formula: One Relationship at a Time', '89'],
          ['Ch. 5', 'The MAP: Your 90-Day Activation Plan', '115'],
          ['Ch. 6', 'The Content Engine: Staying Visible', '143'],
          ['Ch. 7', 'RROS in Practice: Client Case Studies', '171'],
          ['Epilogue', 'The Firm That Gets Built One Call at a Time', '203'],
        ].map(([ch, title, pg]) => (
          <li key={ch} className="dh-toc-item">
            <span className="dh-toc-ch">{ch}</span>
            <span className="dh-toc-title">{title}</span>
            <span className="dh-toc-dots" />
            <span className="dh-toc-pg">{pg}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    eyebrow: 'Introduction · Page 7',
    title: 'Why Your Next Client Is Already Waiting',
    subtitle: null,
    content: (
      <>
        <p>
          Every professional services firm we've ever worked with has the same problem. They
          believe growth requires prospecting — cold outreach, conferences, digital ads, a new
          vertical. They spend their energy pushing outward, toward strangers, while the people who
          already know them, like them, and would pay them sit untouched in a contact list.
        </p>
        <blockquote className="dh-blockquote">
          "The average PS firm principal has 2,000+ relevant contacts. Fewer than 8% of those
          contacts receive any meaningful outreach in a given year. The other 92% drift — and
          eventually, to a competitor."
        </blockquote>
        <p>
          We call those 92% <strong>the Dead Zone</strong>. It's not a graveyard. It's inventory.
          Warm, pre-qualified inventory that your competitors haven't touched because they don't
          know you own it.
        </p>
        <p>
          This book is a system for activating that inventory. Not with a spray-and-pray email
          blast. With a principled, measurable, repeatable approach to moving real relationships
          from dormant to revenue-generating.
        </p>
      </>
    ),
  },
  {
    eyebrow: 'Chapter 1 · Page 19',
    title: 'The Dead Zone: Where Revenue Disappears',
    subtitle: null,
    content: (
      <>
        <p>
          Pull up your CRM. Or your LinkedIn connections. Or the business cards still sitting in a
          drawer from the last conference you attended before the world went remote.
        </p>
        <p>
          How many of those people know what you do today — specifically, not generally? How many
          have seen your work in the last 90 days? How many would say, unprompted, "you should call
          [your name]" if a colleague mentioned they needed exactly what you offer?
        </p>
        <p>For most firms, the honest answer is: almost none.</p>
        <blockquote className="dh-blockquote">
          "The Dead Zone isn't about bad relationships. It's about invisible ones. People who would
          hire you, if they remembered you existed."
        </blockquote>
        <p>
          The Dead Zone is the gap between <strong>who you know</strong> and{' '}
          <strong>who knows what you're doing now</strong>. And it grows every single month you
          don't have a system to close it.
        </p>
      </>
    ),
  },
  {
    eyebrow: 'Chapter 1 · Page 28',
    title: 'The Five Orbits Framework',
    subtitle: null,
    content: (
      <>
        <p>
          Not all relationships are the same. Treating a past client the same as a LinkedIn
          connection you've never met isn't relationship management — it's noise generation.
        </p>
        <p>
          The <strong>Five Orbits</strong> framework gives you a way to segment your relationship
          universe by proximity and temperature:
        </p>
        <ul className="dh-orbits">
          {[
            ['Core Proof', "Past clients, active champions. People who've seen your work firsthand."],
            ['Active', 'Current contacts, warm conversations, recent engagements.'],
            ['Dead Zone', 'Lapsed contacts, cold connections. High potential, low activation.'],
            ['Warm Adjacency', 'One degree out. People your clients know and could introduce.'],
            ['New Gravity', 'New markets, cold audiences. Expensive to reach, lowest conversion.'],
          ].map(([name, desc]) => (
            <li key={name}>
              <strong>{name}</strong> — {desc}
            </li>
          ))}
        </ul>
        <p>Most firms spend 80% of their energy on New Gravity. The RROS flips that ratio.</p>
      </>
    ),
  },
  {
    eyebrow: 'Chapter 2 · Page 41',
    title: 'Five Orbits: The Relationship Map',
    subtitle: null,
    content: (
      <>
        <p>
          Imagine your contact universe as a solar system — not a flat list. The center is your
          firm. Orbiting it, at different distances, are the people who could become clients,
          referral sources, or champions.
        </p>
        <p>
          The closer to the center, the warmer the relationship. The further out, the more energy
          it takes to pull someone in.
        </p>
        <blockquote className="dh-blockquote">
          "Every firm has a gravity problem. They keep launching rockets toward new stars while the
          planets already in their orbit drift away."
        </blockquote>
        <p>
          The MAP — Mabbly Activation Plan — is built to reverse that drift. One relationship at a
          time, starting with the orbit closest to your center.
        </p>
        <p>
          In the next chapter, we'll show you how to read the signals that tell you{' '}
          <em>which</em> relationships are ready to activate — and which need more warmth
          before you reach out.
        </p>
      </>
    ),
  },
];

export default function DiscoverHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const floatTRef = useRef(0);

  const [readerOpen, setReaderOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const readerOpenRef = useRef(false);

  useEffect(() => {
    readerOpenRef.current = readerOpen;
  }, [readerOpen]);

  useEffect(() => {
    function tick() {
      floatTRef.current += 0.018;
      const floatY = Math.sin(floatTRef.current) * 7;
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.06;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.06;
      if (sceneRef.current) {
        if (readerOpenRef.current) {
          sceneRef.current.style.transform = `translateY(${floatY * 0.4}px)`;
        } else {
          sceneRef.current.style.transform = `rotateY(${currentRef.current.x}deg) rotateX(${-currentRef.current.y}deg) translateY(${floatY}px)`;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    targetRef.current = {
      x: ((e.clientX - cx) / (window.innerWidth / 2)) * 18,
      y: ((e.clientY - cy) / (window.innerHeight / 2)) * 13,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    targetRef.current = { x: 0, y: 0 };
  }, []);

  const openBook = useCallback(() => {
    setCurrentPage(0);
    setReaderOpen(true);
  }, []);

  return (
    <>
      <style>{`
        .dh-root {
          width: 100%;
          min-height: 100vh;
          background: #1C1008;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: 'Inter Tight', 'Inter', sans-serif;
          padding: 80px 40px;
        }
        .dh-glow {
          position: absolute;
          width: 560px;
          height: 560px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(184,147,58,.11) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .dh-inner {
          display: flex;
          align-items: center;
          gap: 72px;
          max-width: 1000px;
          width: 100%;
          position: relative;
          z-index: 2;
        }
        @media (max-width: 768px) {
          .dh-inner { flex-direction: column; gap: 48px; }
          .dh-copy { text-align: center; }
          .dh-ctas { justify-content: center; }
        }
        .dh-copy {
          flex: 1;
          min-width: 0;
          transition: opacity 380ms ease, transform 380ms ease,
            max-width 600ms cubic-bezier(0.55, 0.05, 0.2, 1),
            margin 600ms cubic-bezier(0.55, 0.05, 0.2, 1);
        }
        .dh-inner.dh-reader-open { justify-content: center; }
        .dh-inner.dh-reader-open .dh-copy {
          opacity: 0;
          transform: translateX(-24px);
          max-width: 0;
          margin: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .dh-eyebrow {
          font-size: 11px;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: #B8933A;
          margin-bottom: 20px;
          font-weight: 500;
        }
        .dh-headline {
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 500;
          line-height: 1.05;
          letter-spacing: -0.025em;
          color: #F5EFE0;
          margin-bottom: 24px;
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
        .dh-headline em { font-style: normal; color: #B8933A; }
        .dh-sub {
          font-size: 20px;
          font-weight: 300;
          line-height: 1.5;
          letter-spacing: -0.005em;
          color: rgba(245,239,224,0.70);
          max-width: 480px;
          margin-bottom: 0;
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
        .dh-counter {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #B8933A;
          margin-top: 32px;
        }
        .dh-book-wrap {
          flex-shrink: 0;
          perspective: 900px;
          cursor: pointer;
          position: relative;
          padding-bottom: 48px;
          transform-origin: center center;
          transition: transform 700ms cubic-bezier(0.55, 0.05, 0.2, 1);
        }
        .dh-inner.dh-reader-open .dh-book-wrap { transform: scale(2.2); }
        @media (max-width: 768px) {
          .dh-inner.dh-reader-open .dh-book-wrap { transform: scale(1.5); }
        }
        .dh-book-scene {
          width: 190px;
          height: 272px;
          transform-style: preserve-3d;
          position: relative;
          will-change: transform;
        }
        .dh-face {
          position: absolute;
          width: 190px;
          height: 272px;
          backface-visibility: hidden;
        }
        /* ── Front cover that flips around its left edge ── */
        .dh-cover-flip {
          position: absolute;
          width: 190px;
          height: 272px;
          top: 0;
          left: 0;
          transform-style: preserve-3d;
          transform-origin: 0 50% 0;
          transform: translateZ(15px) rotateY(0deg);
          transition: transform 1100ms cubic-bezier(0.55, 0.05, 0.2, 1);
          will-change: transform;
        }
        .dh-cover-flip.dh-cover-flipped {
          transform: translateZ(15px) rotateY(-158deg);
        }
        .dh-cover-out, .dh-cover-in {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
        }
        .dh-cover-out {
          border-radius: 1px 5px 5px 1px;
          overflow: hidden;
        }
        .dh-cover-out img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }
        .dh-cover-in {
          transform: rotateY(180deg);
          background: #F5EFE0;
          border-radius: 5px 1px 1px 5px;
          padding: 12px 14px 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: inset -1px 0 0 rgba(58,42,16,0.06);
        }
        .dh-lpage-body { padding-top: 4px; }
        .dh-lpage-eyebrow {
          font-size: 8px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #B8933A;
          margin-bottom: 10px;
          font-family: 'Inter Tight', 'Inter', sans-serif;
        }
        .dh-lpage-title {
          font-size: 16px;
          font-weight: 400;
          line-height: 1.15;
          color: #2A1A08;
          font-family: 'Cormorant Garamond', Georgia, serif;
          margin-bottom: 8px;
        }
        .dh-lpage-sub {
          font-size: 10px;
          color: #6A5038;
          font-style: italic;
          line-height: 1.45;
          font-family: 'Cormorant Garamond', Georgia, serif;
          white-space: pre-line;
        }
        .dh-lpage-rule {
          width: 28px;
          height: 1.2px;
          background: #B8933A;
          margin-top: 14px;
        }
        .dh-lpage-foot {
          font-size: 7.5px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(184,147,58,0.7);
          font-family: 'Inter Tight', 'Inter', sans-serif;
          text-align: center;
        }

        /* ── Right page (revealed when cover flips open) ── */
        .dh-rpage {
          position: absolute;
          width: 190px;
          height: 272px;
          top: 0;
          left: 0;
          transform: translateZ(13px);
          background: #F5EFE0;
          border-radius: 1px 5px 5px 1px;
          padding: 12px 14px 10px;
          display: flex;
          flex-direction: column;
          opacity: 0;
          pointer-events: none;
          transition: opacity 280ms ease 520ms;
          box-shadow: inset 1px 0 0 rgba(58,42,16,0.06);
        }
        .dh-rpage.dh-rpage-on {
          opacity: 1;
          pointer-events: auto;
        }
        .dh-pg-close {
          position: absolute;
          top: 4px;
          right: 6px;
          width: 16px;
          height: 16px;
          border: none;
          background: none;
          font-size: 16px;
          line-height: 1;
          color: #8B7355;
          cursor: pointer;
          padding: 0;
          font-family: 'Inter Tight', sans-serif;
          z-index: 2;
        }
        .dh-pg-close:hover { color: #2A1A08; }
        .dh-rpage-body {
          flex: 1;
          overflow-y: auto;
          font-size: 10px;
          line-height: 1.55;
          color: #3A2A10;
          font-family: 'Cormorant Garamond', Georgia, serif;
          padding-right: 4px;
        }
        .dh-rpage-body p { margin-bottom: 8px; }
        .dh-rpage-body strong { font-weight: 700; color: #2A1A08; }
        .dh-rpage-body em { font-style: italic; }
        .dh-rpage-body .dh-blockquote {
          border-left: 1.5px solid #B8933A;
          padding: 6px 10px;
          background: #EDE4CC;
          margin: 8px 0;
          font-size: 9.5px;
          font-style: italic;
          color: #4A3A1A;
          line-height: 1.5;
          border-radius: 0 2px 2px 0;
        }
        .dh-rpage-body .dh-toc {
          list-style: none;
          padding: 0;
          margin-top: 2px;
        }
        .dh-rpage-body .dh-toc-item {
          display: flex;
          align-items: baseline;
          gap: 5px;
          padding: 5px 0;
          border-bottom: 1px solid #E4D4B4;
          font-size: 9px;
          color: #3A2A10;
          font-family: 'Instrument Sans', sans-serif;
        }
        .dh-rpage-body .dh-toc-ch {
          font-size: 7px;
          color: #B8933A;
          font-weight: 600;
          letter-spacing: 0.1em;
          min-width: 36px;
          text-transform: uppercase;
        }
        .dh-rpage-body .dh-toc-title { flex: 1; }
        .dh-rpage-body .dh-toc-dots {
          flex: 0 1 18px;
          border-bottom: 1px dotted #C0A86A;
          margin-bottom: 1px;
        }
        .dh-rpage-body .dh-toc-pg { font-size: 7.5px; color: #8B7355; }
        .dh-rpage-body .dh-orbits {
          padding-left: 0;
          list-style: none;
          margin: 7px 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .dh-rpage-body .dh-orbits li {
          font-size: 9px;
          line-height: 1.45;
          color: #3A2A10;
          padding-left: 7px;
          border-left: 1.5px solid #B8933A;
        }
        .dh-rpage-body .dh-orbits strong { color: #B8933A; font-weight: 600; }
        .dh-rpage-body .dh-meta {
          font-size: 8.5px;
          color: #8B7355;
          margin-top: 2px;
          font-family: 'Instrument Sans', sans-serif;
        }
        .dh-rpage-body .dh-legal {
          margin-top: 12px;
          font-size: 7.5px;
          color: #6A5038;
          line-height: 1.55;
          font-family: 'Instrument Sans', sans-serif;
        }
        .dh-rpage-body::-webkit-scrollbar { width: 2px; }
        .dh-rpage-body::-webkit-scrollbar-track { background: transparent; }
        .dh-rpage-body::-webkit-scrollbar-thumb { background: rgba(184,147,58,0.35); border-radius: 1px; }

        .dh-rpage-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
          padding-top: 6px;
          margin-top: 4px;
          border-top: 1px solid rgba(184,147,58,0.25);
        }
        .dh-pg-arrow {
          background: none;
          border: 1px solid rgba(184,147,58,0.4);
          color: #B8933A;
          width: 18px;
          height: 16px;
          font-size: 11px;
          line-height: 1;
          padding: 0;
          border-radius: 1px;
          cursor: pointer;
          font-family: 'Inter Tight', sans-serif;
          transition: border-color 0.15s, opacity 0.15s;
        }
        .dh-pg-arrow:disabled { opacity: 0.25; cursor: default; }
        .dh-pg-arrow:not(:disabled):hover { border-color: rgba(184,147,58,0.85); }
        .dh-pg-num {
          font-size: 8px;
          letter-spacing: 0.14em;
          color: rgba(184,147,58,0.7);
          font-family: 'Inter Tight', sans-serif;
        }

        .dh-back {
          transform: rotateY(180deg) translateZ(15px);
          background: #C8B88A;
          border-radius: 5px 1px 1px 5px;
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
        }
        .dh-back p {
          font-size: 11px;
          color: #3A2A10;
          line-height: 1.6;
          font-style: italic;
          font-family: Georgia, serif;
          text-align: center;
        }
        .dh-back cite {
          display: block;
          margin-top: 12px;
          font-size: 9px;
          color: #7A6040;
          font-style: normal;
          letter-spacing: .1em;
          text-transform: uppercase;
        }
        .dh-spine {
          position: absolute;
          width: 30px;
          height: 272px;
          left: -15px; top: 0;
          transform: rotateY(-90deg) translateZ(0px);
          background: linear-gradient(180deg, #C8B070 0%, #A8903A 30%, #907820 70%, #C8B070 100%);
          display: flex; align-items: center; justify-content: center;
        }
        .dh-spine-text {
          font-size: 8px;
          font-weight: 600;
          color: #3A2A10;
          letter-spacing: .14em;
          text-transform: uppercase;
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
          white-space: nowrap;
          font-family: 'Inter Tight', 'Inter', sans-serif;
        }
        .dh-top {
          position: absolute;
          width: 190px; height: 30px;
          top: -15px; left: 0;
          transform: rotateX(90deg) translateZ(0px);
          background: #D4C48A;
        }
        .dh-bottom {
          position: absolute;
          width: 190px; height: 30px;
          bottom: -15px; left: 0;
          transform: rotateX(-90deg) translateZ(0px);
          background: #C8B88A;
        }
        .dh-shadow {
          position: absolute;
          bottom: 8px; left: 50%;
          transform: translateX(-50%);
          width: 170px; height: 20px;
          background: radial-gradient(ellipse, rgba(0,0,0,.55) 0%, transparent 70%);
          filter: blur(8px);
        }
        .dh-click-hint {
          position: absolute;
          bottom: 4px; left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          opacity: .55;
        }
        .dh-click-hint span {
          font-size: 10px;
          letter-spacing: .1em;
          color: #B8933A;
          text-transform: uppercase;
          white-space: nowrap;
          font-family: 'Inter Tight', 'Inter', sans-serif;
        }
        .dh-click-hint svg { animation: dhBounce .9s ease-in-out infinite; }
        @keyframes dhBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(3px); }
        }
        .dh-pg-eyebrow {
          font-size: 10px;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: #B8933A;
          margin-bottom: 20px;
          font-family: 'Inter Tight', 'Inter', sans-serif;
        }
        .dh-pg-title {
          font-size: clamp(24px, 3vw, 36px);
          font-weight: 400;
          line-height: 1.18;
          color: #2A1A08;
          font-family: 'Cormorant Garamond', Georgia, serif;
          margin-bottom: 10px;
        }
        .dh-pg-sub {
          font-size: 15px;
          color: #6A5038;
          font-style: italic;
          margin-bottom: 28px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          line-height: 1.5;
          white-space: pre-line;
        }
        .dh-divider {
          width: 48px; height: 2px;
          background: #B8933A;
          margin: 20px 0 28px;
        }
        .dh-pg-body {
          font-size: 15px;
          line-height: 1.82;
          color: #3A2A10;
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
        .dh-pg-body p { margin-bottom: 18px; }
        .dh-pg-body strong { font-weight: 700; color: #2A1A08; }
        .dh-pg-body em { font-style: italic; }
        .dh-meta {
          font-size: 13px;
          color: #8B7355;
          margin-top: 4px;
          font-family: 'Instrument Sans', sans-serif;
        }
        .dh-legal {
          margin-top: 28px;
          font-size: 12px;
          color: #6A5038;
          line-height: 1.7;
          font-family: 'Instrument Sans', sans-serif;
        }
        .dh-blockquote {
          border-left: 3px solid #B8933A;
          padding: 14px 22px;
          background: #EDE4CC;
          border-radius: 0 3px 3px 0;
          margin: 22px 0;
          font-size: 15px;
          font-style: italic;
          color: #4A3A1A;
          line-height: 1.7;
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
        .dh-toc { list-style: none; margin-top: 8px; }
        .dh-toc-item {
          display: flex;
          align-items: baseline;
          gap: 8px;
          padding: 11px 0;
          border-bottom: 1px solid #E4D4B4;
          font-size: 14px;
          color: #3A2A10;
          font-family: 'Instrument Sans', sans-serif;
        }
        .dh-toc-ch {
          font-size: 10px;
          color: #B8933A;
          font-weight: 600;
          letter-spacing: .1em;
          min-width: 68px;
          text-transform: uppercase;
        }
        .dh-toc-title { flex: 1; }
        .dh-toc-dots {
          flex: 0 1 48px;
          border-bottom: 1px dotted #C0A86A;
          margin-bottom: 3px;
        }
        .dh-toc-pg { font-size: 12px; color: #8B7355; }
        .dh-orbits {
          padding-left: 0;
          list-style: none;
          margin: 18px 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .dh-orbits li {
          font-size: 14px;
          line-height: 1.6;
          color: #3A2A10;
          padding-left: 16px;
          border-left: 2px solid #B8933A;
        }
        .dh-orbits strong { color: #B8933A; font-weight: 600; }
      `}</style>

      <section
        className="dh-root"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="dh-glow" />
        <div className={`dh-inner ${readerOpen ? 'dh-reader-open' : ''}`}>
          <div className="dh-copy">
            <h1 className="dh-headline">
              Professional services firms deserve marketing as sophisticated as the work they sell
              <em>.</em>
            </h1>
            <p className="dh-sub">
              Read the manuscript before publication. Shape the book.
            </p>
            <p className="dh-counter">
              30 PS firms in &nbsp;·&nbsp; 70 spots remain
            </p>
          </div>

          <div
            className="dh-book-wrap"
            ref={wrapRef}
            onClick={readerOpen ? () => setReaderOpen(false) : openBook}
            style={{ cursor: 'pointer' }}
          >
            <div className="dh-book-scene" ref={sceneRef}>
              {/* Back cover (outside, faces away) */}
              <div className="dh-face dh-back">
                <div>
                  <p>
                    "The firms that grow aren't the ones with the best services. They're the ones
                    with the best system for turning relationships into revenue."
                    <cite>— Adam Fridman</cite>
                  </p>
                </div>
              </div>

              {/* Right page — revealed when cover flips open */}
              <div className={`dh-rpage ${readerOpen ? 'dh-rpage-on' : ''}`}>
                <button
                  className="dh-pg-close"
                  onClick={(e) => { e.stopPropagation(); setReaderOpen(false); }}
                  aria-label="Close reader"
                >
                  ×
                </button>
                <div className="dh-rpage-body">
                  {PAGES[currentPage].content}
                </div>
                <div className="dh-rpage-foot">
                  <button
                    className="dh-pg-arrow"
                    disabled={currentPage === 0}
                    onClick={(e) => { e.stopPropagation(); setCurrentPage((p) => Math.max(0, p - 1)); }}
                    aria-label="Previous page"
                  >
                    ‹
                  </button>
                  <span className="dh-pg-num">{currentPage + 1} / {PAGES.length}</span>
                  <button
                    className="dh-pg-arrow"
                    disabled={currentPage === PAGES.length - 1}
                    onClick={(e) => { e.stopPropagation(); setCurrentPage((p) => Math.min(PAGES.length - 1, p + 1)); }}
                    aria-label="Next page"
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* Front cover — flips backward around its left edge (the spine) */}
              <div className={`dh-cover-flip ${readerOpen ? 'dh-cover-flipped' : ''}`}>
                <div className="dh-cover-out">
                  <img src={bookCover} alt="GTM for Professional Services — book cover" />
                </div>
                <div className="dh-cover-in">
                  <div className="dh-lpage-body">
                    <p className="dh-lpage-eyebrow">{PAGES[currentPage].eyebrow}</p>
                    <h2 className="dh-lpage-title">{PAGES[currentPage].title}</h2>
                    {PAGES[currentPage].subtitle && (
                      <p className="dh-lpage-sub">{PAGES[currentPage].subtitle}</p>
                    )}
                    <div className="dh-lpage-rule" />
                  </div>
                  <p className="dh-lpage-foot">Manuscript Preview</p>
                </div>
              </div>

              <div className="dh-spine">
                <span className="dh-spine-text">Relationship Revenue OS · Fridman &amp; Ashbaugh</span>
              </div>
              <div className="dh-top" />
              <div className="dh-bottom" />
            </div>
            <div className="dh-shadow" />
            <div
              className="dh-click-hint"
              style={{
                opacity: readerOpen ? 0 : 0.55,
                transition: 'opacity 250ms ease',
                pointerEvents: readerOpen ? 'none' : 'auto',
              }}
            >
              <span>click to read</span>
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M5 7L1 1h8L5 7z" fill="#B8933A" />
              </svg>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
