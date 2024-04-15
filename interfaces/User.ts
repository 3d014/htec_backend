export interface UserType {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  pw: string;
  createdAt: Date;
  updatedAt: Date;
  resetPwLink: string;
  userRole: string;
}
