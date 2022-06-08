int foo() {
   //SCOPE_START
   int i;
   int k;
   int h;
   int m;
   int b;
   {
      int scope;
      int scopeStmt2;
   }
   if(0 == 0) {
      //IF_START
      int ifWithoutElse;
      int ifWithoutElseStmt2;
      //IF_END
   }
   int abc;
   if(0 != 0) {
      //IF_START
      {
         {
            int ifWithElseThen;
            int ifWithElseThenStmt2;
         }
         int j;
         if(1 == 1) {
            //IF_START
            int if1equals1;
            //IF_END
         }
         else {
            //IF_START
            int elseif;
            if(2 == 2) {
               //IF_START
               int ifihefi;
               //IF_END
            }
            int ijfij;
            //IF_END
         }
      }
      int s;
      //IF_END
   }
   else {
      //IF_START
      int ifWithElseElse;
      int ifWithElseElseStmt2;
      //IF_END
   }
   int afterIfElse;
   for(int i = 0; i < 10; i++) {
      //FOR_START
      int loopBody;
      int loopBodyStmt2;
      for(int l = 0; l < 5; l++) {
         //FOR_START
         int innerFor;
         for(int k = 0; k < 4; k++) {
            //FOR_START
            int innerInnerFor;
            {
               int jijrg;
            }
            {
               int qqq;
            }
            for(int m = 0; m < 4; m++) {
               //FOR_START
               int innerIfFor;
               int ineneuhg;
               if(3 == 3) {
                  //IF_START
                  int jgji;
                  int jijgij;
                  //IF_END
               }
               int ijfiji;
               //FOR_END
            }
            //FOR_END
         }
         //FOR_END
      }
      //FOR_END
   }
   int betweenFor;
   for(int k = 0; k < 4; k++) {
      //FOR_START
      int forLoop;
      int forLoop2;
      for(int j = 0; j < 4; j++) {
         //FOR_START
         int hkngkg;
         int argrghr;
         //FOR_END
      }
      //FOR_END
   }
   //SCOPE_END
}

/*
#include <stdio.h>
#include <math.h>
#include <stdlib.h>

// Knobs
int BS2 = 32;
int BS1 = 64;
*/
/*
Simple matrix multiplication example.
*/
/*
matrix multiplication
*/
/*
void matrix_mult(double const * A, double const * B, double * C, int const N, int const M, int const K) {
for(int ii = 0; ii < N; ii++) {
for(int jj = 0; jj < K; jj++) {
C[K * ii + jj] = 0;
}
}
#pragma matrix_loop
for(int i_block = 0; i_block < N; i_block += BS1) {
{
int i_limit = i_block + BS1;if(i_limit > N)i_limit = N;
for(int l_block = 0; l_block < M; l_block += BS2) {
for(int i = i_block; i < i_limit; i++) {
{
int l_limit = l_block + BS2;if(l_limit > M)l_limit = M;
for(int l = l_block; l < l_limit; l++) {
for(int j = 0; j < K; j++) {
C[K * i + j] += A[M * i + l] * B[K * l + j];
}
}
}
}
}
}
}
}
*/
/*
* Set an N by M matrix A to random values
*/
/*
void init_matrix(double * A, int const N, int const M) {
for(int i = 0; i < N; ++i) {
for(int j = 0; j < M; ++j) {
A[M * i + j] = ((double) rand()) / (double) 2147483647;
}
}
}

void print_matrix_result(double * A, int const N, int const K) {
double acc = 0.0;
for(int i = 0; i < N; ++i) {
for(int j = 0; j < K; ++j) {
acc += A[K * i + j];
}
}
printf("Result acc: %f\n", acc);
}

void test_matrix_mul() {
int N = 512;
int M = 256;
int K = 512;
double * A = (double *) malloc(N * M * sizeof(double));
double * B = (double *) malloc(M * K * sizeof(double));
double * C = (double *) malloc(N * K * sizeof(double));
// initialize matrices
init_matrix(A, N, M);
init_matrix(B, M, K);
// do: C = A*B
matrix_mult(A, B, C, N, M, K);
print_matrix_result(C, N, K);
}

int main() {
// To make results repeatable
srand(0);
test_matrix_mul();
}
*/