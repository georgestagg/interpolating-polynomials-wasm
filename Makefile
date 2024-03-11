BLAS = ../BLAS-3.12.0/blas_LINUX.a
LAPACK = ../lapack-3.12.0/liblapack.a
EMCC = emcc
EMFC = ../build/bin/flang-new
FFLAGS = -O2
FORTRAN_RUNTIME = ../build/flang/runtime/libFortranRuntime.a
OBJECTS = vandermonde.o

CFLAGS = -O2
LDFLAGS = -s ALLOW_MEMORY_GROWTH=1 -s STACK_SIZE=4MB
LDFLAGS += -sEXPORTED_FUNCTIONS=_vandermonde_,_malloc,_free
LDFLAGS += $(BLAS) $(LAPACK) $(FORTRAN_RUNTIME)

all: www/vandermonde.js

www/vandermonde.js: $(OBJECTS)
	$(EMCC) $(CFLAGS) $(LDFLAGS) $(OBJECTS) -o $@

%.o: %.f90 Makefile
	$(EMFC) $(FFLAGS) -o $@ -c $<

clean:
	rm -f $(OBJECTS) www/vandermonde.js
