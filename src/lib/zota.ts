let shadId: number | null = null;

export const zota = {
  get: () => shadId,
  set: (id: number) => {
    shadId = id;
  },
};
