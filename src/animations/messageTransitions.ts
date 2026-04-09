import { gsap } from 'gsap';

export const animateMessageIn = (element: HTMLElement, isUser: boolean) => {
  gsap.from(element, {
    opacity: 0,
    y: isUser ? 20 : -20,
    scale: 0.98,
    duration: 0.4,
    ease: "power2.out",
    clearProps: "all"
  });
};
