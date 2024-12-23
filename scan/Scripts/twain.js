/* ======================================================================== *\

  Copyright (C) 2007 TWAIN Working Group: Adobe Systems Incorporated, 
  AnyDoc Software Inc., Eastman Kodak Company, Fujitsu Computer Products 
  of America, JFL Peripheral Solutions Inc., Ricoh Corporation, and 
  Xerox Corporation.  All rights reserved.

  Copyright (C) 1991, 1992 TWAIN Working Group: Aldus, Caere, Eastman-Kodak,
  Hewlett-Packard and Logitech Corporations.  All rights reserved.

  Copyright (C) 1997 TWAIN Working Group: Bell+Howell, Canon, DocuMagix, 
  Fujitsu, Genoa Technology, Hewlett-Packard, Kofax Imaging Products, and
  Ricoh Corporation.  All rights reserved.
 
  Copyright (C) 1998 TWAIN Working Group: Adobe Systems Incorporated, 
  Canon Information Systems, Eastman Kodak Company, 
  Fujitsu Computer Products of America, Genoa Technology, 
  Hewlett-Packard Company, Intel Corporation, Kofax Image Products, 
  JFL Peripheral Solutions Inc., Ricoh Corporation, and Xerox Corporation.  
  All rights reserved.

  Copyright (C) 2000 TWAIN Working Group: Adobe Systems Incorporated, 
  Canon Information Systems, Digimarc Corporation, Eastman Kodak Company, 
  Fujitsu Computer Products of America, Hewlett-Packard Company, 
  JFL Peripheral Solutions Inc., Ricoh Corporation, and Xerox Corporation.  
  All rights reserved.


  TWAIN.h -  This is the definitive include file for applications and
          data sources written to the TWAIN specification.
          It defines constants, data structures, messages etc.
          for the public interface to TWAIN.
 
  Revision History:
    version 1.0, March 6, 1992.  TWAIN 1.0.
    version 1.1, January 1993.   Tech Notes 1.1
    version 1.5, June 1993.      Specification Update 1.5
                                 Change DC to TW 
                                 Change filename from DC.H to TWAIN.H
    version 1.5, July 1993.      Remove spaces from country identifiers
 
    version 1.7, July 1997       Added Capabilities and data structure for 
                                 document imaging and digital cameras.
                                 KHL.
    version 1.7, July 1997       Inserted Borland compatibile structure packing
                                 directives provided by Mentor.  JMH
    version 1.7, Aug 1997        Expanded file tabs to spaces.  
                                 NOTE: future authors should be sure to have 
                                 their editors set to automatically expand tabs 
                                 to spaces (original tab setting was 4 spaces).
    version 1.7, Sept 1997       Added job control values
                                 Added return codes
    version 1.7, Sept 1997       changed definition of pRGBRESPONSE to 
                                 pTW_RGBRESPONSE
    version 1.7  Aug 1998        Added missing TWEI_BARCODEROTATION values
                                 TWBCOR_ types JMH
    version 1.8  August 1998     Added new types and definitions required
                                 for 1.8 Specification JMH
    version 1.8  January 1999    Changed search mode from SRCH_ to TWBD_ as
                                 in 1.8 Specification, added TWBT_MAXICODE JMH
    version 1.8  January 1999    Removed undocumented duplicate AUTO<cap> JMH
    version 1.8  March 1999      Removed undocumented 1.8 caps:
                                 CAP_FILESYSTEM
                                 CAP_PAPERBINDING
                                 CAP_PASSTHRU
                                 CAP_POWERDOWNTIME
                                 ICAP_AUTODISCARDBLANKPAGES
                               * CAP_PAGEMULTIPLEACQUIRE - is CAP_REACQUIREALLOWED,
                               requires spec change.  JMH
                                 Added Mac structure packing modifications JMH
    version 1.9  March 2000  Added new types and definations required
                             for 1.9 Specification MLM
    version 1.9  March 2000  Added ICAP_JPEGQUALITY, TWJQ_ values,
                                 updated TWON_PROTOCOLMINOR for Release v1.9 MN
    version 1.91 August 2007     Added new types and definitions required
                                 for 1.91 Specification MLM
    version 2.0  Sept 2007       Added new types and definitions required
                                 for 2.0 Specification FHH
    version 2.0  Mar 2008        Depreciated ICAP_PIXELTYPEs TWPT_SRGB64, TWPT_BGR, 
                                 TWPT_CIELAB, TWPT_CIELUV, and TWPT_YCBCR  JMW
    version 2.0  Mar 2008        Added missing new 2.0 CAP_ definitions JMW
    version 2.0  Dec 2008        Updated TW_INFO structure for 64bit JMW
    version 2.1  Mar 2009        Added new types and definitions required
                                 for 2.1 Specification JMW
    version 2.2  Nov 2010        Added new types and definitions required
                                 for 2.2 Specification MSM
    version 2.3  Feb 2013        Added new types and definitions required
                                 for 2.3 Specification MLM
\* ======================================================================== */

var TWAIN = TWAIN | {};


/****************************************************************************
 * TWAIN Version                                                            *
 ****************************************************************************/
var TWON_PROTOCOLMINOR =  3;        /* Changed for Version 2.3            */
var TWON_PROTOCOLMAJOR =  2;

/****************************************************************************
 * Platform Dependent Definitions and Typedefs                              *
 ****************************************************************************/

/* Microsoft C/C++ Compiler */
/*#if defined(WIN32) || defined(WIN64) || defined (_WINDOWS)
    #define TWH_CMP_MSC
    #if  defined(_WIN64) || defined(WIN64)
      #define TWH_64BIT
    #elif defined(WIN32) || defined(_WIN32)
      #define TWH_32BIT
    #endif

/* GNU C/C++ Compiler */
/*#elif defined(__GNUC__)
    #define TWH_CMP_GNU
    #if defined(__alpha__)\
        ||defined(__ia64__)\
        ||defined(__ppc64__)\
        ||defined(__s390x__)\
        ||defined(__x86_64__)
      #define TWH_64BIT
    #else
      #define TWH_32BIT
    #endif


/* Borland C/C++ Compiler */
/*#elif defined(__BORLAND__)
    #define TWH_CMP_BORLAND
    #define TWH_32BIT
/* Unrecognized */
/*#else
    #error Unrecognized compiler
#endif

/* Apple Compiler (which is GNU now) */
/*#if defined(__APPLE__)
  #define TWH_CMP_XCODE
  #ifdef __MWERKS__
    #include <Carbon.h>
  #else
    #include <Carbon/Carbon.h>
  #endif
#endif

/* Win32 and Win64 systems */
/*#if defined(TWH_CMP_MSC) | defined(TWH_CMP_BORLAND)
    typedef HANDLE  TW_HANDLE;
    typedef LPVOID  TW_MEMREF;
    typedef UINT_PTR TW_UINTPTR;

/* MacOS/X... */ 
/*#elif defined(TWH_CMP_XCODE)
    #define PASCAL   pascal
    #define FAR
    typedef Handle   TW_HANDLE;
    typedef char    *TW_MEMREF;
    typedef unsigned char BYTE;

    #ifdef TWH_32BIT
      //32 bit GNU
      typedef unsigned long      TW_UINTPTR;
    #else
      //64 bit GNU
      typedef unsigned long long TW_UINTPTR;
    #endif

/* Everything else... */ 
/*#else
    #define PASCAL
    #define FAR
    typedef void* TW_HANDLE;
    typedef void* TW_MEMREF;
    typedef unsigned char BYTE;

    #ifdef TWH_32BIT
      //32 bit GNU
      typedef unsigned long      TW_UINTPTR;
    #else
      //64 bit GNU
      typedef unsigned long long TW_UINTPTR;
    #endif
#endif


/* Set the packing: this occurs before any structures are defined */
/*#ifdef TWH_CMP_MSC
    #pragma pack (push, before_twain)
    #pragma pack (2)
#elif defined(TWH_CMP_GNU)
    #if defined(__APPLE__) /* cf: Mac version of TWAIN.h */
  /*      #pragma options align = power
    #else
        #pragma pack (push, before_twain)
        #pragma pack (2)
    #endif
#elif defined(TWH_CMP_BORLAND)
    #pragma option -a2
#endif


/****************************************************************************
 * Type Definitions                                                         *
 ****************************************************************************/

/* String types. These include room for the strings and a NULL char,     *
 * or, on the Mac, a length byte followed by the string.                 *
 * TW_STR255 must hold less than 256 chars so length fits in first byte. */
/*#if defined(__APPLE__)/* cf: Mac version of TWAIN.h */
    /*typedef unsigned char TW_STR32[34],     FAR *pTW_STR32;
    typedef unsigned char TW_STR64[66],     FAR *pTW_STR64;
    typedef unsigned char TW_STR128[130],   FAR *pTW_STR128;
    typedef unsigned char TW_STR255[256],   FAR *pTW_STR255;
#else
    typedef char          TW_STR32[34],     FAR *pTW_STR32;
    typedef char          TW_STR64[66],     FAR *pTW_STR64;
    typedef char          TW_STR128[130],   FAR *pTW_STR128;
    typedef char          TW_STR255[256],   FAR *pTW_STR255;
#endif

/* Numeric types. */
/*typedef char           	  TW_INT8,          FAR *pTW_INT8;
typedef short          	  TW_INT16,         FAR *pTW_INT16;
#if defined(__APPLE__) /* cf: Mac version of TWAIN.h */
    /*typedef int           TW_INT32,         FAR *pTW_INT32;
#else
    typedef long          TW_INT32,         FAR *pTW_INT32;
#endif
typedef unsigned char     TW_UINT8,         FAR *pTW_UINT8;
typedef unsigned short    TW_UINT16,        FAR *pTW_UINT16;
#if defined(__APPLE__) /* cf: Mac version of TWAIN.h */
    /*typedef unsigned int  TW_UINT32,        FAR *pTW_UINT32;
#else
    typedef unsigned long TW_UINT32,        FAR *pTW_UINT32;
#endif
typedef unsigned short    TW_BOOL,          FAR *pTW_BOOL;


/****************************************************************************
 * Structure Definitions                                                    *
 ****************************************************************************/

/* Fixed point structure type. */
/*typedef struct {
    TW_INT16     Whole;  
    TW_UINT16    Frac;
} TW_FIX32,  FAR *pTW_FIX32;

/* Defines a frame rectangle in ICAP_UNITS coordinates. */
/*typedef struct {
   TW_FIX32   Left;
   TW_FIX32   Top;
   TW_FIX32   Right;
   TW_FIX32   Bottom;
} TW_FRAME, FAR * pTW_FRAME;

/* Defines the parameters used for channel-specific transformation. */
/*typedef struct {
   TW_FIX32   StartIn;
   TW_FIX32   BreakIn;
   TW_FIX32   EndIn;
   TW_FIX32   StartOut;
   TW_FIX32   BreakOut;
   TW_FIX32   EndOut;
   TW_FIX32   Gamma;
   TW_FIX32   SampleCount;
} TW_DECODEFUNCTION, FAR * pTW_DECODEFUNCTION;

/* Stores a Fixed point number in two parts, a whole and a fractional part. */
/*typedef struct {
   TW_DECODEFUNCTION   Decode[3];
   TW_FIX32            Mix[3][3];
} TW_TRANSFORMSTAGE, FAR * pTW_TRANSFORMSTAGE;

/* Container for array of values */
/*typedef struct {
   TW_UINT16  ItemType;
   TW_UINT32  NumItems;    
   TW_UINT8   ItemList[1]; 
} TW_ARRAY, FAR * pTW_ARRAY;

/* Information about audio data */
/*typedef struct {
   TW_STR255  Name;
   TW_UINT32  Reserved;
} TW_AUDIOINFO, FAR * pTW_AUDIOINFO;

/* Used to register callbacks. */
/*typedef struct  {
    TW_MEMREF      CallBackProc;
    #if defined(__APPLE__) /* cf: Mac version of TWAIN.h */
 /*       TW_MEMREF  RefCon;
    #else
        TW_UINT32  RefCon;
    #endif
    TW_INT16       Message;
} TW_CALLBACK, FAR * pTW_CALLBACK;

/* Used to register callbacks. */
/*typedef struct  {
    TW_MEMREF   CallBackProc;
    TW_UINTPTR  RefCon;
    TW_INT16    Message;
} TW_CALLBACK2, FAR * pTW_CALLBACK2;

/* Used by application to get/set capability from/in a data source. */
/*typedef struct {
   TW_UINT16  Cap; 
   TW_UINT16  ConType; 
   TW_HANDLE  hContainer;
} TW_CAPABILITY, FAR * pTW_CAPABILITY;

/* Defines a CIE XYZ space tri-stimulus value. */
/*typedef struct {
   TW_FIX32   X;
   TW_FIX32   Y;
   TW_FIX32   Z;
} TW_CIEPOINT, FAR * pTW_CIEPOINT;

/* Defines the mapping from an RGB color space device into CIE 1931 (XYZ) color space. */
/*typedef struct {
   TW_UINT16           ColorSpace;
   TW_INT16            LowEndian;
   TW_INT16            DeviceDependent;
   TW_INT32            VersionNumber;
   TW_TRANSFORMSTAGE   StageABC;
   TW_TRANSFORMSTAGE   StageLMN;
   TW_CIEPOINT         WhitePoint;
   TW_CIEPOINT         BlackPoint;
   TW_CIEPOINT         WhitePaper;
   TW_CIEPOINT         BlackInk;
   TW_FIX32            Samples[1];
} TW_CIECOLOR, FAR * pTW_CIECOLOR;

/* Allows for a data source and application to pass custom data to each other. */
/*typedef struct {
    TW_UINT32  InfoLength;
    TW_HANDLE  hData;
}TW_CUSTOMDSDATA, FAR *pTW_CUSTOMDSDATA;

/* Provides information about the Event that was raised by the Source */
/*typedef struct {
   TW_UINT32  Event;
   TW_STR255  DeviceName;
   TW_UINT32  BatteryMinutes;
   TW_INT16   BatteryPercentage;
   TW_INT32   PowerSupply;
   TW_FIX32   XResolution;
   TW_FIX32   YResolution;
   TW_UINT32  FlashUsed2;
   TW_UINT32  AutomaticCapture;
   TW_UINT32  TimeBeforeFirstCapture;
   TW_UINT32  TimeBetweenCaptures;
} TW_DEVICEEVENT, FAR * pTW_DEVICEEVENT;

/* This structure holds the tri-stimulus color palette information for TW_PALETTE8 structures.*/
/*typedef struct {
   TW_UINT8    Index;
   TW_UINT8    Channel1;
   TW_UINT8    Channel2;
   TW_UINT8    Channel3;
} TW_ELEMENT8, FAR * pTW_ELEMENT8;

/* Stores a group of individual values describing a capability. */
/*typedef struct {
   TW_UINT16  ItemType;
   TW_UINT32  NumItems;
   TW_UINT32  CurrentIndex;
   TW_UINT32  DefaultIndex;
   TW_UINT8   ItemList[1];
} TW_ENUMERATION, FAR * pTW_ENUMERATION;

/* Used to pass application events/messages from the application to the Source. */
/*typedef struct {
   TW_MEMREF  pEvent;
   TW_UINT16  TWMessage;
} TW_EVENT, FAR * pTW_EVENT;

/* This structure is used to pass specific information between the data source and the application. */
/*typedef struct {
    TW_UINT16   InfoID;
    TW_UINT16   ItemType;
    TW_UINT16   NumItems;
    union {
        TW_UINT16   ReturnCode;
        TW_UINT16   CondCode; // Deprecated, do not use
    };
    TW_UINTPTR  Item;
}TW_INFO, FAR* pTW_INFO;

/*typedef struct {
    TW_UINT32   NumInfos;
    TW_INFO     Info[1];
}TW_EXTIMAGEINFO, FAR* pTW_EXTIMAGEINFO;

/* Provides information about the currently selected device */
/*typedef struct {
   TW_STR255  InputName;
   TW_STR255  OutputName;
   TW_MEMREF  Context;
   union {
	 int 	    Recursive;
	 TW_BOOL	Subdirectories;
   };
   union {
	 TW_INT32 	FileType;
	 TW_UINT32	FileSystemType;
   };
   TW_UINT32  Size;
   TW_STR32   CreateTimeDate;
   TW_STR32   ModifiedTimeDate;
   TW_UINT32  FreeSpace;
   TW_INT32   NewImageSize;
   TW_UINT32  NumberOfFiles;
   TW_UINT32  NumberOfSnippets;
   TW_UINT32  DeviceGroupMask;
   TW_INT8    Reserved[508];
} TW_FILESYSTEM, FAR * pTW_FILESYSTEM;

/* This structure is used by the application to specify a set of mapping values to be applied to grayscale data. */
/*typedef struct {
   TW_ELEMENT8         Response[1];
} TW_GRAYRESPONSE, FAR * pTW_GRAYRESPONSE;

/* A general way to describe the version of software that is running. */
/*typedef struct {
   TW_UINT16  MajorNum;
   TW_UINT16  MinorNum;
   TW_UINT16  Language;
   TW_UINT16  Country;
   TW_STR32   Info;
} TW_VERSION, FAR * pTW_VERSION;

/* Provides identification information about a TWAIN entity.*/
/*typedef struct {
    #if defined(__APPLE__) /* cf: Mac version of TWAIN.h */
 /*       TW_MEMREF  Id;
    #else
        TW_UINT32  Id;
    #endif
    TW_VERSION 	   Version;
    TW_UINT16  	   ProtocolMajor;
    TW_UINT16  	   ProtocolMinor;
    TW_UINT32  	   SupportedGroups;
    TW_STR32   	   Manufacturer;
    TW_STR32   	   ProductFamily;
    TW_STR32   	   ProductName;
} TW_IDENTITY, FAR * pTW_IDENTITY;

/* Describes the "real" image data, that is, the complete image being transferred between the Source and application. */
/*typedef struct {
   TW_FIX32   XResolution;
   TW_FIX32   YResolution;
   TW_INT32   ImageWidth;
   TW_INT32   ImageLength;
   TW_INT16   SamplesPerPixel;
   TW_INT16   BitsPerSample[8];
   TW_INT16   BitsPerPixel;
   TW_BOOL    Planar;
   TW_INT16   PixelType;
   TW_UINT16  Compression;
} TW_IMAGEINFO, FAR * pTW_IMAGEINFO;

/* Involves information about the original size of the acquired image. */
/*typedef struct {
   TW_FRAME   Frame;
   TW_UINT32  DocumentNumber;
   TW_UINT32  PageNumber;
   TW_UINT32  FrameNumber;
} TW_IMAGELAYOUT, FAR * pTW_IMAGELAYOUT;

/* Provides information for managing memory buffers. */
/*typedef struct {
   TW_UINT32  Flags;
   TW_UINT32  Length;
   TW_MEMREF  TheMem;
} TW_MEMORY, FAR * pTW_MEMORY;

/* Describes the form of the acquired data being passed from the Source to the application.*/
/*typedef struct {
   TW_UINT16  Compression;
   TW_UINT32  BytesPerRow;
   TW_UINT32  Columns;
   TW_UINT32  Rows;
   TW_UINT32  XOffset;
   TW_UINT32  YOffset;
   TW_UINT32  BytesWritten;
   TW_MEMORY  Memory;
} TW_IMAGEMEMXFER, FAR * pTW_IMAGEMEMXFER;

/* Describes the information necessary to transfer a JPEG-compressed image. */
/*typedef struct {
   TW_UINT16   ColorSpace;
   TW_UINT32   SubSampling;
   TW_UINT16   NumComponents;
   TW_UINT16   RestartFrequency;
   TW_UINT16   QuantMap[4];
   TW_MEMORY   QuantTable[4];
   TW_UINT16   HuffmanMap[4];
   TW_MEMORY   HuffmanDC[2];
   TW_MEMORY   HuffmanAC[2];
} TW_JPEGCOMPRESSION, FAR * pTW_JPEGCOMPRESSION;

/* Stores a single value (item) which describes a capability. */
/*typedef struct {
   TW_UINT16  ItemType;
   TW_UINT32  Item;
} TW_ONEVALUE, FAR * pTW_ONEVALUE;

/* This structure holds the color palette information. */
/*typedef struct {
   TW_UINT16    NumColors;
   TW_UINT16    PaletteType;
   TW_ELEMENT8  Colors[256];
} TW_PALETTE8, FAR * pTW_PALETTE8;

/* Used to bypass the TWAIN protocol when communicating with a device */
/*typedef struct {
   TW_MEMREF  pCommand;
   TW_UINT32  CommandBytes;
   TW_INT32   Direction;
   TW_MEMREF  pData;
   TW_UINT32  DataBytes;
   TW_UINT32  DataBytesXfered;
} TW_PASSTHRU, FAR * pTW_PASSTHRU;

/* This structure tells the application how many more complete transfers the Source currently has available. */
/*typedef struct {
   TW_UINT16 Count;
   union {
       TW_UINT32 EOJ;
       TW_UINT32 Reserved;
       #if defined(__APPLE__) /* cf: Mac version of TWAIN.h */
       /*    union {
               TW_UINT32 EOJ;
               TW_UINT32 Reserved;
           } TW_JOBCONTROL;
       #endif
   };
} TW_PENDINGXFERS, FAR *pTW_PENDINGXFERS;

/* Stores a range of individual values describing a capability. */
/*typedef struct {
   TW_UINT16  ItemType;
   TW_UINT32  MinValue;
   TW_UINT32  MaxValue;
   TW_UINT32  StepSize;
   TW_UINT32  DefaultValue;
   TW_UINT32  CurrentValue;
} TW_RANGE, FAR * pTW_RANGE;

/* This structure is used by the application to specify a set of mapping values to be applied to RGB color data. */
/*typedef struct {
   TW_ELEMENT8         Response[1];
} TW_RGBRESPONSE, FAR * pTW_RGBRESPONSE;

/* Describes the file format and file specification information for a transfer through a disk file. */
/*typedef struct {
   TW_STR255 FileName;
   TW_UINT16 Format;
   TW_INT16  VRefNum;
} TW_SETUPFILEXFER, FAR * pTW_SETUPFILEXFER;

/* Provides the application information about the Source's requirements and preferences regarding allocation of transfer buffer(s). */
/*typedef struct {
   TW_UINT32 MinBufSize;
   TW_UINT32 MaxBufSize;
   TW_UINT32 Preferred;
} TW_SETUPMEMXFER, FAR * pTW_SETUPMEMXFER;

/* Describes the status of a source. */
/*typedef struct {
   TW_UINT16  ConditionCode;
   union {
     TW_UINT16  Data;
     TW_UINT16  Reserved;
   };
} TW_STATUS, FAR * pTW_STATUS;

/* Translates the contents of Status into a localized UTF8string. */
/*typedef struct {
   TW_STATUS    Status;
   TW_UINT32    Size;
   TW_HANDLE    UTF8string;
} TW_STATUSUTF8, FAR * pTW_STATUSUTF8;

/* This structure is used to handle the user interface coordination between an application and a Source. */
/*typedef struct {
   TW_BOOL    ShowUI;
   TW_BOOL    ModalUI;
   TW_HANDLE  hParent;
} TW_USERINTERFACE, FAR * pTW_USERINTERFACE;


/****************************************************************************
 * Generic Constants                                                        *
 ****************************************************************************/

var TWON_ARRAY     =      3;
var TWON_ENUMERATION  =   4;
var TWON_ONEVALUE      =  5;
var TWON_RANGE      =     6;

var TWON_ICONID    =      962;
var TWON_DSMID      =     461;
var TWON_DSMCODEID   =    63 ;

var TWON_DONTCARE8      = 0xff;
var TWON_DONTCARE16     = 0xffff;
var TWON_DONTCARE32     = 0xffffffff;

/* Flags used in TW_MEMORY structure. */
var TWMF_APPOWNS    = 0x0001;
var TWMF_DSMOWNS    = 0x0002;
var TWMF_DSOWNS     = 0x0004;
var TWMF_POINTER    = 0x0008;
var TWMF_HANDLE     = 0x0010;

var TWTY_INT8       = 0x0000;
var TWTY_INT16      = 0x0001;
var TWTY_INT32      = 0x0002;

var TWTY_UINT8      = 0x0003;
var TWTY_UINT16     = 0x0004;
var TWTY_UINT32     = 0x0005;

var TWTY_BOOL       = 0x0006;

var TWTY_FIX32      = 0x0007;

var TWTY_FRAME      = 0x0008;

var TWTY_STR32      = 0x0009;
var TWTY_STR64      = 0x000a;
var TWTY_STR128     = 0x000b;
var TWTY_STR255     = 0x000c;
var TWTY_HANDLE     = 0x000f;


/****************************************************************************
 * Capability Constants                                                     *
 ****************************************************************************/

/* CAP_ALARMS values */
var TWAL_ALARM         =      0;
var TWAL_FEEDERERROR    =     1;
var TWAL_FEEDERWARNING   =    2;
var TWAL_BARCODE          =   3;
var TWAL_DOUBLEFEED        =  4;
var TWAL_JAM                = 5;
var TWAL_PATCHCODE        =   6;
var TWAL_POWER             =  7;
var TWAL_SKEW               = 8;

/* ICAP_AUTOSIZE values */
var TWAS_NONE     =           0;
var TWAS_AUTO      =          1;
var TWAS_CURRENT    =         2;

/* TWEI_BARCODEROTATION values */
var TWBCOR_ROT0  =            0;
var TWBCOR_ROT90  =           1;
var TWBCOR_ROT180  =          2;
var TWBCOR_ROT270   =         3;
var TWBCOR_ROTX      =        4;

/* ICAP_BARCODESEARCHMODE values */
var TWBD_HORZ   =             0;
var TWBD_VERT    =            1;
var TWBD_HORZVERT =           2;
var TWBD_VERTHORZ  =          3;

/* ICAP_BITORDER values */
var TWBO_LSBFIRST   =         0;
var TWBO_MSBFIRST    =        1;

/* ICAP_AUTODISCARDBLANKPAGES values */
var TWBP_DISABLE   =       -2;
var TWBP_AUTO      =         -1;

/* ICAP_BITDEPTHREDUCTION values */
var TWBR_THRESHOLD   =        0;
var TWBR_HALFTONE     =       1;
var TWBR_CUSTHALFTONE  =      2;
var TWBR_DIFFUSION      =     3;
var TWBR_DYNAMICTHRESHOLD=    4;

/* ICAP_SUPPORTEDBARCODETYPES and TWEI_BARCODETYPE values*/
var TWBT_3OF9                 =0;
var TWBT_2OF5INTERLEAVED     = 1;
var TWBT_2OF5NONINTERLEAVED   =2;
var TWBT_CODE93 =              3;
var TWBT_CODE128 =             4;
var TWBT_UCC128   =            5;
var TWBT_CODABAR   =           6;
var TWBT_UPCA       =          7;
var TWBT_UPCE        =         8;
var TWBT_EAN8         =        9;
var TWBT_EAN13         =       10;
var TWBT_POSTNET        =      11;
var TWBT_PDF417          =     12;
var TWBT_2OF5INDUSTRIAL   =    13;
var TWBT_2OF5MATRIX        =   14;
var TWBT_2OF5DATALOGIC      =  15;
var TWBT_2OF5IATA            = 16;
var TWBT_3OF9FULLASCII        =17;
var TWBT_CODABARWITHSTARTSTOP =18;
var TWBT_MAXICODE          =   19;
var TWBT_QRCODE             =  20;

/* ICAP_COMPRESSION values*/
var TWCP_NONE       =         0;
var TWCP_PACKBITS    =        1;
var TWCP_GROUP31D     =       2;
var TWCP_GROUP31DEOL   =      3;
var TWCP_GROUP32D       =     4;
var TWCP_GROUP4          =    5;
var TWCP_JPEG             =   6;
var TWCP_LZW               =  7;
var TWCP_JBIG               = 8;
var TWCP_PNG                 =9;
var TWCP_RLE4       =        10;
var TWCP_RLE8        =       11;
var TWCP_BITFIELDS    =      12;
var TWCP_ZIP           =     13;
var TWCP_JPEG2000       =    14;

/* CAP_CAMERASIDE and TWEI_PAGESIDE values */
var TWCS_BOTH     =           0;
var TWCS_TOP       =          1;
var TWCS_BOTTOM     =         2;

/* CAP_CLEARBUFFERS values */
var TWCB_AUTO           =     0;
var TWCB_CLEAR           =    1;
var TWCB_NOCLEAR          =   2;

/* CAP_DEVICEEVENT values */
var TWDE_CUSTOMEVENTS          = 0x8000      ;
var TWDE_CHECKAUTOMATICCAPTURE  =0;
var TWDE_CHECKBATTERY          = 1;
var TWDE_CHECKDEVICEONLINE    =  2;
var TWDE_CHECKFLASH          =   3;
var TWDE_CHECKPOWERSUPPLY   =    4;
var TWDE_CHECKRESOLUTION   =     5;
var TWDE_DEVICEADDED      =      6;
var TWDE_DEVICEOFFLINE   =       7;
var TWDE_DEVICEREADY    =        8;
var TWDE_DEVICEREMOVED          =9;
var TWDE_IMAGECAPTURED         = 10;
var TWDE_IMAGEDELETED         =  11;
var TWDE_PAPERDOUBLEFEED     =   12;
var TWDE_PAPERJAM           =    13;
var TWDE_LAMPFAILURE       =     14;
var TWDE_POWERSAVE        =      15;
var TWDE_POWERSAVENOTIFY =       16;

/* TW_PASSTHRU.Direction values. */
var TWDR_GET         =        1;
var TWDR_SET          =       2 ;  

/* TWEI_DESKEWSTATUS values. */
var TWDSK_SUCCESS     =       0;
var TWDSK_REPORTONLY   =      1;
var TWDSK_FAIL          =     2;
var TWDSK_DISABLED       =    3;

/* CAP_DUPLEX values */
var TWDX_NONE             =   0;
var TWDX_1PASSDUPLEX       =  1;
var TWDX_2PASSDUPLEX        = 2;

/* CAP_FEEDERALIGNMENT values */
var TWFA_NONE        =        0;
var TWFA_LEFT         =       1;
var TWFA_CENTER        =      2;
var TWFA_RIGHT          =     3;

/* ICAP_FEEDERTYPE values*/
var TWFE_GENERAL         =    0;
var TWFE_PHOTO            =   1;

/* ICAP_IMAGEFILEFORMAT values */
var TWFF_TIFF    =            0;
var TWFF_PICT     =           1;
var TWFF_BMP       =          2;
var TWFF_XBM        =         3;
var TWFF_JFIF        =        4;
var TWFF_FPX          =       5;
var TWFF_TIFFMULTI     =      6;
var TWFF_PNG            =     7;
var TWFF_SPIFF           =    8;
var TWFF_EXIF             =   9;
var TWFF_PDF      =          10;
var TWFF_JP2       =         11;
var TWFF_JPX        =        13;
var TWFF_DEJAVU      =       14;
var TWFF_PDFA         =      15;
var TWFF_PDFA2         =     16;

/* ICAP_FLASHUSED2 values */
var TWFL_NONE  =              0;
var TWFL_OFF    =             1;
var TWFL_ON      =            2;
var TWFL_AUTO     =           3;
var TWFL_REDEYE    =          4;

/* CAP_FEEDERORDER values */
var TWFO_FIRSTPAGEFIRST   =   0;
var TWFO_LASTPAGEFIRST     =  1;

/* CAP_FEEDERPOCKET values*/
var TWFP_POCKETERROR=         0;
var TWFP_POCKET1     =        1;
var TWFP_POCKET2      =       2;
var TWFP_POCKET3       =      3;
var TWFP_POCKET4        =     4;
var TWFP_POCKET5         =    5;
var TWFP_POCKET6          =   6;
var TWFP_POCKET7           =  7;
var TWFP_POCKET8            = 8;
var TWFP_POCKET9             =9;
var TWFP_POCKET10=           10;
var TWFP_POCKET11 =          11;
var TWFP_POCKET12  =         12;
var TWFP_POCKET13   =        13;
var TWFP_POCKET14    =       14;
var TWFP_POCKET15     =      15;
var TWFP_POCKET16      =     16;

/* ICAP_FLIPROTATION values */
var TWFR_BOOK      =          0;
var TWFR_FANFOLD    =         1;

/* ICAP_FILTER values */
var TWFT_RED=                 0;
var TWFT_GREEN=               1;
var TWFT_BLUE  =              2;
var TWFT_NONE   =             3;
var TWFT_WHITE   =            4;
var TWFT_CYAN     =           5;
var TWFT_MAGENTA   =          6;
var TWFT_YELLOW     =         7;
var TWFT_BLACK       =        8;

/* TW_FILESYSTEM.FileType values */
var TWFY_CAMERA   =           0;
var TWFY_CAMERATOP =          1;
var TWFY_CAMERABOTTOM=        2;
var TWFY_CAMERAPREVIEW=       3;
var TWFY_DOMAIN        =      4;
var TWFY_HOST           =     5;
var TWFY_DIRECTORY       =    6;
var TWFY_IMAGE            =   7;
var TWFY_UNKNOWN           =  8;

/* ICAP_ICCPROFILE values */ 
var TWIC_NONE    =            0;
var TWIC_LINK     =           1;
var TWIC_EMBED     =          2;

/* ICAP_IMAGEFILTER values */
var TWIF_NONE =               0;
var TWIF_AUTO  =              1;
var TWIF_LOWPASS=             2;
var TWIF_BANDPASS=            3;
var TWIF_HIGHPASS =           4;
var TWIF_TEXT      =          TWIF_BANDPASS;
var TWIF_FINELINE   =         TWIF_HIGHPASS;

/* ICAP_IMAGEMERGE values */
var TWIM_NONE     =           0;
var TWIM_FRONTONTOP=          1;
var TWIM_FRONTONBOTTOM=       2;
var TWIM_FRONTONLEFT   =      3;
var TWIM_FRONTONRIGHT   =     4;

/* CAP_JOBCONTROL values  */
var TWJC_NONE   =             0;
var TWJC_JSIC    =            1;
var TWJC_JSIS     =           2;
var TWJC_JSXC      =          3;
var TWJC_JSXS       =         4;
                  
/* ICAP_JPEGQUALITY values */
var TWJQ_UNKNOWN  =          -4;
var TWJQ_LOW       =         -3;
var TWJQ_MEDIUM     =        -2;
var TWJQ_HIGH        =       -1;

/* ICAP_LIGHTPATH values */
var TWLP_REFLECTIVE    =      0;
var TWLP_TRANSMISSIVE   =     1;

/* ICAP_LIGHTSOURCE values */
var TWLS_RED      =           0;
var TWLS_GREEN     =          1;
var TWLS_BLUE       =         2;
var TWLS_NONE        =        3;
var TWLS_WHITE        =       4;
var TWLS_UV            =      5;
var TWLS_IR             =     6;

/* TWEI_MAGTYPE values */
var TWMD_MICR      =          0;
var TWMD_RAW        =         1;
var TWMD_INVALID     =        2;

/* ICAP_NOISEFILTER values */
var TWNF_NONE    =            0;
var TWNF_AUTO     =           1;
var TWNF_LONEPIXEL =          2;
var TWNF_MAJORITYRULE=        3;

/* ICAP_ORIENTATION values */
var TWOR_ROT0=                0;
var TWOR_ROT90=               1;
var TWOR_ROT180=              2;
var TWOR_ROT270 =             3;
var TWOR_PORTRAIT=            TWOR_ROT0;
var TWOR_LANDSCAPE=           TWOR_ROT270;
var TWOR_AUTO      =          4;
var TWOR_AUTOTEXT   =         5;
var TWOR_AUTOPICTURE =        6;

/* ICAP_OVERSCAN values */
var TWOV_NONE   =             0;
var TWOV_AUTO    =            1;
var TWOV_TOPBOTTOM=           2;
var TWOV_LEFTRIGHT =          3;
var TWOV_ALL        =         4;

/* Palette types for TW_PALETTE8 */
var TWPA_RGB   =      0;
var TWPA_GRAY   =     1;
var TWPA_CMY     =    2;

/* ICAP_PLANARCHUNKY values */
var TWPC_CHUNKY          =    0;
var TWPC_PLANAR           =   1;

/* TWEI_PATCHCODE values*/
var TWPCH_PATCH1=             0;
var TWPCH_PATCH2 =            1;
var TWPCH_PATCH3  =           2;
var TWPCH_PATCH4   =          3;
var TWPCH_PATCH6    =         4;
var TWPCH_PATCHT     =        5;

/* ICAP_PIXELFLAVOR values */
var TWPF_CHOCOLATE   =        0;
var TWPF_VANILLA      =       1;

/* CAP_PRINTERMODE values */
var TWPM_SINGLESTRING  =      0;
var TWPM_MULTISTRING    =     1;
var TWPM_COMPOUNDSTRING  =    2;

/* CAP_PRINTER values */
var TWPR_IMPRINTERTOPBEFORE=     0;
var TWPR_IMPRINTERTOPAFTER  =    1;
var TWPR_IMPRINTERBOTTOMBEFORE=  2;
var TWPR_IMPRINTERBOTTOMAFTER  = 3;
var TWPR_ENDORSERTOPBEFORE =     4;
var TWPR_ENDORSERTOPAFTER   =    5;
var TWPR_ENDORSERBOTTOMBEFORE =  6;
var TWPR_ENDORSERBOTTOMAFTER =   7;

/* CAP_PRINTERFONTSTYLE Added 2.3 */
var TWPF_NORMAL   =           0;
var TWPF_BOLD      =          1;
var TWPF_ITALIC     =         2;
var TWPF_LARGESIZE   =        3;
var TWPF_SMALLSIZE    =       4;

/* CAP_PRINTERINDEXTRIGGER Added 2.3 */
var TWCT_PAGE  =              0;
var TWCT_PATCH1 =             1;
var TWCT_PATCH2  =            2;
var TWCT_PATCH3   =           3;
var TWCT_PATCH4    =          4;
var TWCT_PATCHT     =         5;
var TWCT_PATCH6      =        6;

/* CAP_POWERSUPPLY values */
var TWPS_EXTERNAL     =       0;
var TWPS_BATTERY       =      1;

/* ICAP_PIXELTYPE values (PT_ means Pixel Type) */
var TWPT_BW  =                0;
var TWPT_GRAY =               1;
var TWPT_RGB   =              2;
var TWPT_PALETTE=             3;
var TWPT_CMY     =            4;
var TWPT_CMYK     =           5;
var TWPT_YUV       =          6;
var TWPT_YUVK       =         7;
var TWPT_CIEXYZ      =        8;
var TWPT_LAB          =       9;
var TWPT_SRGB          =     10;
var TWPT_SCRGB          =    11;
var TWPT_INFRARED        =   16;

/* CAP_SEGMENTED values */
var TWSG_NONE        =        0;
var TWSG_AUTO         =       1;
var TWSG_MANUAL        =      2;

/* ICAP_FILMTYPE values */
var TWFM_POSITIVE       =     0;
var TWFM_NEGATIVE        =    1;

/* CAP_DOUBLEFEEDDETECTION */
var TWDF_ULTRASONIC=          0;
var TWDF_BYLENGTH   =         1;
var TWDF_INFRARED    =        2;

/* CAP_DOUBLEFEEDDETECTIONSENSITIVITY */
var TWUS_LOW          =       0;
var TWUS_MEDIUM        =      1;
var TWUS_HIGH           =     2;

/* CAP_DOUBLEFEEDDETECTIONRESPONSE */
var TWDP_STOP         =        0;
var TWDP_STOPANDWAIT   =       1;
var TWDP_SOUND          =      2;
var TWDP_DONOTIMPRINT    =     3;

/* ICAP_MIRROR values */
var TWMR_NONE           =      0;
var TWMR_VERTICAL        =     1;
var TWMR_HORIZONTAL       =    2;

/* ICAP_JPEGSUBSAMPLING values */
var TWJS_444YCBCR  =          0;
var TWJS_444RGB     =         1;
var TWJS_422         =        2;
var TWJS_421          =       3;
var TWJS_411           =      4;
var TWJS_420            =     5;
var TWJS_410             =    6;
var TWJS_311              =   7;

/* CAP_PAPERHANDLING values */
var TWPH_NORMAL   =           0;
var TWPH_FRAGILE   =          1;
var TWPH_THICK      =         2;
var TWPH_TRIFOLD     =        3;
var TWPH_PHOTOGRAPH   =       4;

/* CAP_INDICATORSMODE values */
var TWCI_INFO     =           0;
var TWCI_WARNING   =          1;
var TWCI_ERROR      =         2;
var TWCI_WARMUP      =        3;

/* ICAP_SUPPORTEDSIZES values (SS_ means Supported Sizes) */
var TWSS_NONE   =             0;
var TWSS_A4      =            1;
var TWSS_JISB5    =           2;
var TWSS_USLETTER  =          3;
var TWSS_USLEGAL    =         4;
var TWSS_A5          =        5;
var TWSS_ISOB4        =       6;
var TWSS_ISOB6         =      7;
var TWSS_USLEDGER       =     9;
var TWSS_USEXECUTIVE     =   10;
var TWSS_A3               =  11;
var TWSS_ISOB3             = 12;
var TWSS_A6                 =13;
var TWSS_C4=                 14;
var TWSS_C5 =                15;
var TWSS_C6  =               16;
var TWSS_4A0  =              17;
var TWSS_2A0   =             18;
var TWSS_A0     =            19;
var TWSS_A1      =           20;
var TWSS_A2       =          21;
var TWSS_A7        =         22;
var TWSS_A8         =        23;
var TWSS_A9          =       24;
var TWSS_A10          =      25;
var TWSS_ISOB0         =     26;
var TWSS_ISOB1          =    27;
var TWSS_ISOB2           =   28;
var TWSS_ISOB5            =  29;
var TWSS_ISOB7             = 30;
var TWSS_ISOB8              =31;
var TWSS_ISOB9=              32;
var TWSS_ISOB10=             33;
var TWSS_JISB0  =            34;
var TWSS_JISB1   =           35;
var TWSS_JISB2    =          36;
var TWSS_JISB3     =         37;
var TWSS_JISB4      =        38;
var TWSS_JISB6       =       39;
var TWSS_JISB7        =      40;
var TWSS_JISB8         =     41;
var TWSS_JISB9          =    42;
var TWSS_JISB10          =   43;
var TWSS_C0               =  44;
var TWSS_C1                = 45;
var TWSS_C2                 =46;
var TWSS_C3  =               47;
var TWSS_C7   =              48;
var TWSS_C8    =             49;
var TWSS_C9     =            50;
var TWSS_C10     =           51;
var TWSS_USSTATEMENT=        52;
var TWSS_BUSINESSCARD=       53;
var TWSS_MAXSIZE      =      54;

/* ICAP_XFERMECH values (SX_ means Setup XFer) */
var TWSX_NATIVE     =         0;
var TWSX_FILE        =        1;
var TWSX_MEMORY       =       2;
var TWSX_MEMFILE       =      4;

/* ICAP_UNITS values (UN_ means UNits) */
var TWUN_INCHES     =         0;
var TWUN_CENTIMETERS =        1;
var TWUN_PICAS        =       2;
var TWUN_POINTS        =      3;
var TWUN_TWIPS          =     4;
var TWUN_PIXELS          =    5;
var TWUN_MILLIMETERS      =   6;


/****************************************************************************
 * Country Constants                                                        *
 ****************************************************************************/

var TWCY_AFGHANISTAN =  1001;
var TWCY_ALGERIA      =  213;
var TWCY_AMERICANSAMOA = 684;
var TWCY_ANDORRA        =033;
var TWCY_ANGOLA =       1002;
var TWCY_ANGUILLA=      8090;
var TWCY_ANTIGUA  =     8091;
var TWCY_ARGENTINA =      54;
var TWCY_ARUBA      =    297;
var TWCY_ASCENSIONI  =   247;
var TWCY_AUSTRALIA    =   61;
var TWCY_AUSTRIA       =  43;
var TWCY_BAHAMAS =      8092;
var TWCY_BAHRAIN  =      973;
var TWCY_BANGLADESH=     880;
var TWCY_BARBADOS   =   8093;
var TWCY_BELGIUM     =    32;
var TWCY_BELIZE       =  501;
var TWCY_BENIN         = 229;
var TWCY_BERMUDA=       8094;
var TWCY_BHUTAN  =      1003;
var TWCY_BOLIVIA  =      591;
var TWCY_BOTSWANA  =     267;
var TWCY_BRITAIN    =      6;
var TWCY_BRITVIRGINIS=  8095;
var TWCY_BRAZIL  =        55;
var TWCY_BRUNEI   =      673;
var TWCY_BULGARIA  =     359;
var TWCY_BURKINAFASO=   1004;
var TWCY_BURMA       =  1005;
var TWCY_BURUNDI      = 1006;
var TWCY_CAMAROON      = 237;
var TWCY_CANADA         =  2;
var TWCY_CAPEVERDEIS =   238;
var TWCY_CAYMANIS     = 8096;
var TWCY_CENTRALAFREP  =1007;
var TWCY_CHAD   =       1008;
var TWCY_CHILE   =        56;
var TWCY_CHINA    =       86;
var TWCY_CHRISTMASIS=   1009;
var TWCY_COCOSIS     =  1009;
var TWCY_COLOMBIA     =   57;
var TWCY_COMOROS       =1010;
var TWCY_CONGO =        1011;
var TWCY_COOKIS =       1012;
var TWCY_COSTARICA=     506;
var TWCY_CUBA      =     5;
var TWCY_CYPRUS     =    357;
var TWCY_CZECHOSLOVAKIA=  42;
var TWCY_DENMARK        = 45;
var TWCY_DJIBOUTI  =    1013;
var TWCY_DOMINICA   =   8097;
var TWCY_DOMINCANREP =  8098;
var TWCY_EASTERIS     = 1014;
var TWCY_ECUADOR       = 593;
var TWCY_EGYPT          = 20;
var TWCY_ELSALVADOR=     503;
var TWCY_EQGUINEA   =   1015;
var TWCY_ETHIOPIA    =   251;
var TWCY_FALKLANDIS   = 1016;
var TWCY_FAEROEIS      = 298;
var TWCY_FIJIISLANDS    =679;
var TWCY_FINLAND   =     358;
var TWCY_FRANCE     =     33;
var TWCY_FRANTILLES  =   596;
var TWCY_FRGUIANA     =  594;
var TWCY_FRPOLYNEISA   = 689;
var TWCY_FUTANAIS  =    1043;
var TWCY_GABON      =    241;
var TWCY_GAMBIA      =   220;
var TWCY_GERMANY      =   49;
var TWCY_GHANA         = 233;
var TWCY_GIBRALTER      =350;
var TWCY_GREECE          =30;
var TWCY_GREENLAND  =    299;
var TWCY_GRENADA     =  8099;
var TWCY_GRENEDINES   = 8015;
var TWCY_GUADELOUPE    = 590;
var TWCY_GUAM           =671;
var TWCY_GUANTANAMOBAY =5399;
var TWCY_GUATEMALA  =    502;
var TWCY_GUINEA      =   224;
var TWCY_GUINEABISSAU = 1017;
var TWCY_GUYANA        = 592;
var TWCY_HAITI          =509;
var TWCY_HONDURAS =      504;
var TWCY_HONGKONG  =    852;
var TWCY_HUNGARY    =     36;
var TWCY_ICELAND     =   354;
var TWCY_INDIA        =   91;
var TWCY_INDONESIA     =  62;
var TWCY_IRAN           = 98;
var TWCY_IRAQ   =        964;
var TWCY_IRELAND =       353;
var TWCY_ISRAEL   =      972;
var TWCY_ITALY     =      39;
var TWCY_IVORYCOAST =   225;
var TWCY_JAMAICA     =  8010;
var TWCY_JAPAN        =   81;
var TWCY_JORDAN        = 962;
var TWCY_KENYA          =254;
var TWCY_KIRIBATI  =    1018;
var TWCY_KOREA      =     82;
var TWCY_KUWAIT      =   965;
var TWCY_LAOS         = 1019;
var TWCY_LEBANON       =1020;
var TWCY_LIBERIA     =   231;
var TWCY_LIBYA        =  218;
var TWCY_LIECHTENSTEIN =  41;
var TWCY_LUXENBOURG     =352;
var TWCY_MACAO     =     853;
var TWCY_MADAGASCAR =   1021;
var TWCY_MALAWI      =   265;
var TWCY_MALAYSIA     =   60;
var TWCY_MALDIVES      = 960;
var TWCY_MALI    =      1022;
var TWCY_MALTA    =      356;
var TWCY_MARSHALLIS=     692;
var TWCY_MAURITANIA =   1023;
var TWCY_MAURITIUS   =   230;
var TWCY_MEXICO       =    3;
var TWCY_MICRONESIA    = 691;
var TWCY_MIQUELON       =508;
var TWCY_MONACO    =      33;
var TWCY_MONGOLIA   =   1024;
var TWCY_MONTSERRAT  =  8011;
var TWCY_MOROCCO      =  212;
var TWCY_MOZAMBIQUE    =1025;
var TWCY_NAMIBIA  =      264;
var TWCY_NAURU     =    1026;
var TWCY_NEPAL      =    977;
var TWCY_NETHERLANDS =    31;
var TWCY_NETHANTILLES =  599;
var TWCY_NEVIS         =8012;
var TWCY_NEWCALEDONIA =  687;
var TWCY_NEWZEALAND    =  64;
var TWCY_NICARAGUA      =505;
var TWCY_NIGER =         227;
var TWCY_NIGERIA=        234;
var TWCY_NIUE    =      1027;
var TWCY_NORFOLKI =     1028;
var TWCY_NORWAY    =      47;
var TWCY_OMAN       =    968;
var TWCY_PAKISTAN    =    92;
var TWCY_PALAU        = 1029;
var TWCY_PANAMA        = 507;
var TWCY_PARAGUAY       =595;
var TWCY_PERU       =     51;
var TWCY_PHILLIPPINES=    63;
var TWCY_PITCAIRNIS   = 1030;
var TWCY_PNEWGUINEA    = 675;
var TWCY_POLAND         = 48;
var TWCY_PORTUGAL  =     351;
var TWCY_QATAR      =    974;
var TWCY_REUNIONI    =  1031;
var TWCY_ROMANIA      =   40;
var TWCY_RWANDA        = 250;
var TWCY_SAIPAN         =670;
var TWCY_SANMARINO =      39;
var TWCY_SAOTOME    =   1033;
var TWCY_SAUDIARABIA =   966;
var TWCY_SENEGAL      =  221;
var TWCY_SEYCHELLESIS  =1034;
var TWCY_SIERRALEONE=   1035;
var TWCY_SINGAPORE   =    65;
var TWCY_SOLOMONIS    = 1036;
var TWCY_SOMALI        =1037;
var TWCY_SOUTHAFRICA=    27;
var TWCY_SPAIN       =    34;
var TWCY_SRILANKA     =   94;
var TWCY_STHELENA      =1032;
var TWCY_STKITTS =      8013;
var TWCY_STLUCIA  =     8014;
var TWCY_STPIERRE  =     508;
var TWCY_STVINCENT  =   8015;
var TWCY_SUDAN       =  1038;
var TWCY_SURINAME     =  597;
var TWCY_SWAZILAND     = 268;
var TWCY_SWEDEN         = 46;
var TWCY_SWITZERLAND     =41;
var TWCY_SYRIA  =       1039;
var TWCY_TAIWAN  =       886;
var TWCY_TANZANIA =      255;
var TWCY_THAILAND  =      66;
var TWCY_TOBAGO     =   8016;
var TWCY_TOGO        =   228;
var TWCY_TONGAIS      =  676;
var TWCY_TRINIDAD      =8016;
var TWCY_TUNISIA        =216;
var TWCY_TURKEY     =     90;
var TWCY_TURKSCAICOS =  8017;
var TWCY_TUVALU       = 1040;
var TWCY_UGANDA        = 256;
var TWCY_USSR           =  7;
var TWCY_UAEMIRATES   =  971;
var TWCY_UNITEDKINGDOM =  44;
var TWCY_USA            =  1;
var TWCY_URUGUAY      =  598;
var TWCY_VANUATU       =1041;
var TWCY_VATICANCITY  =   39;
var TWCY_VENEZUELA     =  58;
var TWCY_WAKE        =  1042;
var TWCY_WALLISIS     = 1043;
var TWCY_WESTERNSAHARA =1044;
var TWCY_WESTERNSAMOA=  1045;
var TWCY_YEMEN        = 1046;
var TWCY_YUGOSLAVIA    =  38;
var TWCY_ZAIRE         = 243;
var TWCY_ZAMBIA         =260;
var TWCY_ZIMBABWE    =   263;
var TWCY_ALBANIA      =  355;
var TWCY_ARMENIA       = 374;
var TWCY_AZERBAIJAN     =994;
var TWCY_BELARUS     =   375;
var TWCY_BOSNIAHERZGO =  387;
var TWCY_CAMBODIA      = 855;
var TWCY_CROATIA        =385;
var TWCY_CZECHREPUBLIC=  420;
var TWCY_DIEGOGARCIA   = 246;
var TWCY_ERITREA        =291;
var TWCY_ESTONIA  =      372;
var TWCY_GEORGIA   =     995;
var TWCY_LATVIA     =    371;
var TWCY_LESOTHO     =   266;
var TWCY_LITHUANIA    =  370;
var TWCY_MACEDONIA     = 389;
var TWCY_MAYOTTEIS  =    269;
var TWCY_MOLDOVA     =   373;
var TWCY_MYANMAR      =  95;
var TWCY_NORTHKOREA    = 850;
var TWCY_PUERTORICO  =   787;
var TWCY_RUSSIA       =  7;
var TWCY_SERBIA        = 381;
var TWCY_SLOVAKIA       =421;
var TWCY_SLOVENIA =      386;
var TWCY_SOUTHKOREA=     82;
var TWCY_UKRAINE    =    380;
var TWCY_USVIRGINIS  =   340;
var TWCY_VIETNAM      =  84;

/****************************************************************************
 * Language Constants                                                       *
 ****************************************************************************/
var TWLG_USERLOCALE=           -1;
var TWLG_DAN        =           0;
var TWLG_DUT         =          1;
var TWLG_ENG          =         2;
var TWLG_FCF           =        3;
var TWLG_FIN            =       4;
var TWLG_FRN             =      5;
var TWLG_GER              =     6;
var TWLG_ICE               =    7;
var TWLG_ITN                =   8;
var TWLG_NOR                 =  9;
var TWLG_POR                  = 10;
var TWLG_SPA                   =11;
var TWLG_SWE     =              12;
var TWLG_USA      =             13;
var TWLG_AFRIKAANS =            14;
var TWLG_ALBANIA    =           15;
var TWLG_ARABIC      =          16;
var TWLG_ARABIC_ALGERIA=        17;
var TWLG_ARABIC_BAHRAIN =       18;
var TWLG_ARABIC_EGYPT    =      19;
var TWLG_ARABIC_IRAQ      =     20;
var TWLG_ARABIC_JORDAN     =    21;
var TWLG_ARABIC_KUWAIT      =   22;
var TWLG_ARABIC_LEBANON      =  23;
var TWLG_ARABIC_LIBYA         = 24;
var TWLG_ARABIC_MOROCCO        =25;
var TWLG_ARABIC_OMAN     =      26;
var TWLG_ARABIC_QATAR     =     27;
var TWLG_ARABIC_SAUDIARABIA=    28;
var TWLG_ARABIC_SYRIA       =   29;
var TWLG_ARABIC_TUNISIA      =  30;
var TWLG_ARABIC_UAE           = 31;
var TWLG_ARABIC_YEMEN          =32;
var TWLG_BASQUE     =           33;
var TWLG_BYELORUSSIAN=          34;
var TWLG_BULGARIAN    =         35;
var TWLG_CATALAN       =        36;
var TWLG_CHINESE        =       37;
var TWLG_CHINESE_HONGKONG=      38;
var TWLG_CHINESE_PRC      =     39;
var TWLG_CHINESE_SINGAPORE =    40;
var TWLG_CHINESE_SIMPLIFIED =   41;
var TWLG_CHINESE_TAIWAN      =  42;
var TWLG_CHINESE_TRADITIONAL  = 43;
var TWLG_CROATIA               =44;
var TWLG_CZECH    =             45;
var TWLG_DANISH    =            TWLG_DAN;
var TWLG_DUTCH      =           TWLG_DUT;
var TWLG_DUTCH_BELGIAN=         46;
var TWLG_ENGLISH       =        TWLG_ENG;
var TWLG_ENGLISH_AUSTRALIAN=    47;
var TWLG_ENGLISH_CANADIAN   =   48;
var TWLG_ENGLISH_IRELAND     =  49;
var TWLG_ENGLISH_NEWZEALAND   = 50;
var TWLG_ENGLISH_SOUTHAFRICA   =51;
var TWLG_ENGLISH_UK=            52;
var TWLG_ENGLISH_USA=           TWLG_USA;
var TWLG_ESTONIAN    =          53;
var TWLG_FAEROESE     =         54;
var TWLG_FARSI         =        55;
var TWLG_FINNISH        =       TWLG_FIN;
var TWLG_FRENCH          =      TWLG_FRN;
var TWLG_FRENCH_BELGIAN   =     56;
var TWLG_FRENCH_CANADIAN   =    TWLG_FCF;
var TWLG_FRENCH_LUXEMBOURG  =   57;
var TWLG_FRENCH_SWISS        =  58;
var TWLG_GERMAN               = TWLG_GER;
var TWLG_GERMAN_AUSTRIAN       =59;
var TWLG_GERMAN_LUXEMBOURG   =  60;
var TWLG_GERMAN_LIECHTENSTEIN = 61;
var TWLG_GERMAN_SWISS          =62;
var TWLG_GREEK =                63;
var TWLG_HEBREW =               64;
var TWLG_HUNGARIAN=             65;
var TWLG_ICELANDIC =            TWLG_ICE;
var TWLG_INDONESIAN =           66;
var TWLG_ITALIAN     =          TWLG_ITN;
var TWLG_ITALIAN_SWISS=         67;
var TWLG_JAPANESE      =        68;
var TWLG_KOREAN         =       69;
var TWLG_KOREAN_JOHAB    =      70;
var TWLG_LATVIAN          =     71;
var TWLG_LITHUANIAN        =    72;
var TWLG_NORWEGIAN          =   TWLG_NOR;
var TWLG_NORWEGIAN_BOKMAL    =  73;
var TWLG_NORWEGIAN_NYNORSK    = 74;
var TWLG_POLISH                =75;
var TWLG_PORTUGUESE      =      TWLG_POR;
var TWLG_PORTUGUESE_BRAZIL=     76;
var TWLG_ROMANIAN          =    77;
var TWLG_RUSSIAN            =   78;
var TWLG_SERBIAN_LATIN       =  79;
var TWLG_SLOVAK               = 80;
var TWLG_SLOVENIAN             =81;
var TWLG_SPANISH       =        TWLG_SPA;
var TWLG_SPANISH_MEXICAN=       82;
var TWLG_SPANISH_MODERN  =      83;
var TWLG_SWEDISH          =     TWLG_SWE;
var TWLG_THAI              =    84;
var TWLG_TURKISH            =   85;
var TWLG_UKRANIAN            =  86;
var TWLG_ASSAMESE             = 87;
var TWLG_BENGALI               =88;
var TWLG_BIHARI     =           89;
var TWLG_BODO        =          90;
var TWLG_DOGRI        =         91;
var TWLG_GUJARATI      =        92;
var TWLG_HARYANVI       =       93;
var TWLG_HINDI           =      94;
var TWLG_KANNADA          =     95;
var TWLG_KASHMIRI          =    96;
var TWLG_MALAYALAM          =   97;
var TWLG_MARATHI             =  98;
var TWLG_MARWARI              = 99;
var TWLG_MEGHALAYAN            =100;
var TWLG_MIZO        =          101;
var TWLG_NAGA         =         102;
var TWLG_ORISSI        =        103;
var TWLG_PUNJABI        =       104;
var TWLG_PUSHTU          =      105;
var TWLG_SERBIAN_CYRILLIC =     106;
var TWLG_SIKKIMI           =    107;
var TWLG_SWEDISH_FINLAND    =   108;
var TWLG_TAMIL               =  109;
var TWLG_TELUGU               = 110;
var TWLG_TRIPURI               =111;
var TWLG_URDU         =         112;
var TWLG_VIETNAMESE    =        113;


/****************************************************************************
 * Data Groups                                                              *
 ****************************************************************************/
var DG_CONTROL         = 0x0001;
var DG_IMAGE           = 0x0002;
var DG_AUDIO           = 0x0004;

/* More Data Functionality may be added in the future.
 * These are for items that need to be determined before DS is opened.
 * NOTE: Supported Functionality constants must be powers of 2 as they are
 *       used as bitflags when Application asks DSM to present a list of DSs.
 *       to support backward capability the App and DS will not use the fields
 */
var DF_DSM2            = 0x10000000;
var DF_APP2            = 0x20000000;
                                       
var DF_DS2             = 0x40000000;
                                       
var DG_MASK            = 0xFFFF ;

/****************************************************************************
 *                                                        *
 ****************************************************************************/
var DAT_NULL           = 0x0000;
var DAT_CUSTOMBASE     = 0x8000;

/* Data Argument Types for the DG_CONTROL Data Group. */
var DAT_CAPABILITY     = 0x0001;
var DAT_EVENT          = 0x0002;
var DAT_IDENTITY       = 0x0003;
var DAT_PARENT         = 0x0004;
var DAT_PENDINGXFERS   = 0x0005;
var DAT_SETUPMEMXFER   = 0x0006;
var DAT_SETUPFILEXFER  = 0x0007;
var DAT_STATUS         = 0x0008;
var DAT_USERINTERFACE  = 0x0009;
var DAT_XFERGROUP      = 0x000a;
var DAT_CUSTOMDSDATA   = 0x000c;
var DAT_DEVICEEVENT    = 0x000d;
var DAT_FILESYSTEM     = 0x000e;
var DAT_PASSTHRU       = 0x000f;
var DAT_CALLBACK       = 0x0010;
var DAT_STATUSUTF8     = 0x0011;
var DAT_CALLBACK2      = 0x0012;

/* Data Argument Types for the DG_IMAGE Data Group. */
var DAT_IMAGEINFO      = 0x0101;
var DAT_IMAGELAYOUT    = 0x0102;
var DAT_IMAGEMEMXFER   = 0x0103;
var DAT_IMAGENATIVEXFER= 0x0104;
var DAT_IMAGEFILEXFER  = 0x0105;
var DAT_CIECOLOR       = 0x0106;
var DAT_GRAYRESPONSE   = 0x0107;
var DAT_RGBRESPONSE    = 0x0108;
var DAT_JPEGCOMPRESSION= 0x0109;
var DAT_PALETTE8       = 0x010a;
var DAT_EXTIMAGEINFO   = 0x010b;
var DAT_FILTER         = 0x010c;

/* Data Argument Types for the DG_AUDIO Data Group. */
var DAT_AUDIOFILEXFER  = 0x0201;
var DAT_AUDIOINFO      = 0x0202;
var DAT_AUDIONATIVEXFER= 0x0203;

/* misplaced */
var DAT_ICCPROFILE       = 0x0401;
var DAT_IMAGEMEMFILEXFER = 0x0402;
var DAT_ENTRYPOINT       = 0x0403;


/****************************************************************************
 * Messages                                                                 *
 ****************************************************************************/

/* All message constants are unique.
 * Messages are grouped according to which DATs they are used with.*/

var MSG_NULL           = 0x0000;
var MSG_CUSTOMBASE     = 0x8000;

/* Generic messages may be used with any of several DATs.                   */
var MSG_GET            = 0x0001;
var MSG_GETCURRENT     = 0x0002;
var MSG_GETDEFAULT     = 0x0003;
var MSG_GETFIRST       = 0x0004;
var MSG_GETNEXT        = 0x0005;
var MSG_SET            = 0x0006;
var MSG_RESET          = 0x0007;
var MSG_QUERYSUPPORT   = 0x0008;
var MSG_GETHELP        = 0x0009;
var MSG_GETLABEL       = 0x000a;
var MSG_GETLABELENUM   = 0x000b;
var MSG_SETCONSTRAINT  = 0x000c;

/* Messages used with DAT_NULL                                              */
var MSG_XFERREADY   = 0x0101;
var MSG_CLOSEDSREQ  = 0x0102;
var MSG_CLOSEDSOK   = 0x0103;
var MSG_DEVICEEVENT = 0x0104;

/* Messages used with a pointer to DAT_PARENT data                          */
var MSG_OPENDSM     = 0x0301;
var MSG_CLOSEDSM    = 0x0302;

/* Messages used with a pointer to a DAT_IDENTITY structure                 */
var MSG_OPENDS      = 0x0401;
var MSG_CLOSEDS     = 0x0402;
var MSG_USERSELECT  = 0x0403;

/* Messages used with a pointer to a DAT_USERINTERFACE structure            */
var MSG_DISABLEDS   = 0x0501;
var MSG_ENABLEDS    = 0x0502;
var MSG_ENABLEDSUIONLY = 0x0503;

/* Messages used with a pointer to a DAT_EVENT structure                    */
var MSG_PROCESSEVENT= 0x0601;

/* Messages used with a pointer to a DAT_PENDINGXFERS structure             */
var MSG_ENDXFER     = 0x0701;
var MSG_STOPFEEDER  = 0x0702;

/* Messages used with a pointer to a DAT_FILESYSTEM structure               */
var MSG_CHANGEDIRECTORY  = 0x0801;
var MSG_CREATEDIRECTORY  = 0x0802;
var MSG_DELETE           = 0x0803;
var MSG_FORMATMEDIA      = 0x0804;
var MSG_GETCLOSE         = 0x0805;
var MSG_GETFIRSTFILE     = 0x0806;
var MSG_GETINFO          = 0x0807;
var MSG_GETNEXTFILE      = 0x0808;
var MSG_RENAME           = 0x0809;
var MSG_COPY             = 0x080A;
var MSG_AUTOMATICCAPTUREDIRECTORY= 0x080B;

/* Messages used with a pointer to a DAT_PASSTHRU structure                 */
var MSG_PASSTHRU         = 0x0901;

/* used with DAT_CALLBACK */
var MSG_REGISTER_CALLBACK= 0x0902;

/* used with DAT_CAPABILITY */
var MSG_RESETALL         = 0x0A01;

/****************************************************************************
 * Capabilities                                                             *
 ****************************************************************************/

var CAP_CUSTOMBASE         = 0x8000; /* Base of custom capabilities */

/* all data sources are REQUIRED to support these caps */
var CAP_XFERCOUNT          = 0x0001;

/* image data sources are REQUIRED to support these caps */
var ICAP_COMPRESSION       = 0x0100;
var ICAP_PIXELTYPE         = 0x0101;
var ICAP_UNITS             = 0x0102;
var ICAP_XFERMECH          = 0x0103;

/* all data sources MAY support these caps */
var CAP_AUTHOR                 = 0x1000;
var CAP_CAPTION                = 0x1001;
var CAP_FEEDERENABLED          = 0x1002;
var CAP_FEEDERLOADED           = 0x1003;
var CAP_TIMEDATE               = 0x1004;
var CAP_SUPPORTEDCAPS          = 0x1005;
var CAP_EXTENDEDCAPS           = 0x1006;
var CAP_AUTOFEED               = 0x1007;
var CAP_CLEARPAGE              = 0x1008;
var CAP_FEEDPAGE               = 0x1009;
var CAP_REWINDPAGE             = 0x100a;
var CAP_INDICATORS             = 0x100b;
var CAP_PAPERDETECTABLE        = 0x100d;
var CAP_UICONTROLLABLE         = 0x100e;
var CAP_DEVICEONLINE           = 0x100f;
var CAP_AUTOSCAN               = 0x1010;
var CAP_THUMBNAILSENABLED      = 0x1011;
var CAP_DUPLEX                 = 0x1012;
var CAP_DUPLEXENABLED          = 0x1013;
var CAP_ENABLEDSUIONLY         = 0x1014;
var CAP_CUSTOMDSDATA           = 0x1015;
var CAP_ENDORSER               = 0x1016;
var CAP_JOBCONTROL             = 0x1017;
var CAP_ALARMS                 = 0x1018;
var CAP_ALARMVOLUME            = 0x1019;
var CAP_AUTOMATICCAPTURE       = 0x101a;
var CAP_TIMEBEFOREFIRSTCAPTURE = 0x101b;
var CAP_TIMEBETWEENCAPTURES    = 0x101c;
var CAP_CLEARBUFFERS           = 0x101d;
var CAP_MAXBATCHBUFFERS        = 0x101e;
var CAP_DEVICETIMEDATE         = 0x101f;
var CAP_POWERSUPPLY            = 0x1020;
var CAP_CAMERAPREVIEWUI        = 0x1021;
var CAP_DEVICEEVENT            = 0x1022;
var CAP_SERIALNUMBER           = 0x1024;
var CAP_PRINTER                = 0x1026;
var CAP_PRINTERENABLED         = 0x1027;
var CAP_PRINTERINDEX           = 0x1028;
var CAP_PRINTERMODE            = 0x1029;
var CAP_PRINTERSTRING          = 0x102a;
var CAP_PRINTERSUFFIX          = 0x102b;
var CAP_LANGUAGE               = 0x102c;
var CAP_FEEDERALIGNMENT        = 0x102d;
var CAP_FEEDERORDER            = 0x102e;
var CAP_REACQUIREALLOWED       = 0x1030;
var CAP_BATTERYMINUTES         = 0x1032;
var CAP_BATTERYPERCENTAGE      = 0x1033;
var CAP_CAMERASIDE             = 0x1034;
var CAP_SEGMENTED              = 0x1035;
var CAP_CAMERAENABLED          = 0x1036;
var CAP_CAMERAORDER            = 0x1037;
var CAP_MICRENABLED            = 0x1038;
var CAP_FEEDERPREP             = 0x1039;
var CAP_FEEDERPOCKET           = 0x103a;
var CAP_AUTOMATICSENSEMEDIUM   = 0x103b;
var CAP_CUSTOMINTERFACEGUID    = 0x103c;
var CAP_SUPPORTEDCAPSSEGMENTUNIQUE   = 0x103d;
var CAP_SUPPORTEDDATS          = 0x103e;
var CAP_DOUBLEFEEDDETECTION    = 0x103f;
var CAP_DOUBLEFEEDDETECTIONLENGTH= 0x1040;
var CAP_DOUBLEFEEDDETECTIONSENSITIVITY= 0x1041;
var CAP_DOUBLEFEEDDETECTIONRESPONSE= 0x1042;
var CAP_PAPERHANDLING          = 0x1043;
var CAP_INDICATORSMODE         = 0x1044;
var CAP_PRINTERVERTICALOFFSET  = 0x1045;
var CAP_POWERSAVETIME          = 0x1046;
var CAP_PRINTERCHARROTATION	   = 0x1047;
var CAP_PRINTERFONTSTYLE       = 0x1048;
var CAP_PRINTERINDEXLEADCHAR   = 0x1049;
var CAP_PRINTERINDEXMAXVALUE   = 0x104A;
var CAP_PRINTERINDEXNUMDIGITS  = 0x104B;
var CAP_PRINTERINDEXSTEP       = 0x104C;
var CAP_PRINTERINDEXTRIGGER    = 0x104D;
var CAP_PRINTERSTRINGPREVIEW   = 0x104E;



/* image data sources MAY support these caps */
var ICAP_AUTOBRIGHT                  = 0x1100;
var ICAP_BRIGHTNESS                  = 0x1101;
var ICAP_CONTRAST                    = 0x1103;
var ICAP_CUSTHALFTONE                = 0x1104;
var ICAP_EXPOSURETIME                = 0x1105;
var ICAP_FILTER                      = 0x1106;
var ICAP_FLASHUSED                   = 0x1107;
var ICAP_GAMMA                       = 0x1108;
var ICAP_HALFTONES                   = 0x1109;
var ICAP_HIGHLIGHT                   = 0x110a;
var ICAP_IMAGEFILEFORMAT             = 0x110c;
var ICAP_LAMPSTATE                   = 0x110d;
var ICAP_LIGHTSOURCE                 = 0x110e;
var ICAP_ORIENTATION                 = 0x1110;
var ICAP_PHYSICALWIDTH               = 0x1111;
var ICAP_PHYSICALHEIGHT              = 0x1112;
var ICAP_SHADOW                      = 0x1113;
var ICAP_FRAMES                      = 0x1114;
var ICAP_XNATIVERESOLUTION           = 0x1116;
var ICAP_YNATIVERESOLUTION           = 0x1117;
var ICAP_XRESOLUTION                 = 0x1118;
var ICAP_YRESOLUTION                 = 0x1119;
var ICAP_MAXFRAMES                   = 0x111a;
var ICAP_TILES                       = 0x111b;
var ICAP_BITORDER                    = 0x111c;
var ICAP_CCITTKFACTOR                = 0x111d;
var ICAP_LIGHTPATH                   = 0x111e;
var ICAP_PIXELFLAVOR                 = 0x111f;
var ICAP_PLANARCHUNKY                = 0x1120;
var ICAP_ROTATION                    = 0x1121;
var ICAP_SUPPORTEDSIZES              = 0x1122;
var ICAP_THRESHOLD                   = 0x1123;
var ICAP_XSCALING                    = 0x1124;
var ICAP_YSCALING                    = 0x1125;
var ICAP_BITORDERCODES               = 0x1126;
var ICAP_PIXELFLAVORCODES            = 0x1127;
var ICAP_JPEGPIXELTYPE               = 0x1128;
var ICAP_TIMEFILL                    = 0x112a;
var ICAP_BITDEPTH                    = 0x112b;
var ICAP_BITDEPTHREDUCTION           = 0x112c;
var ICAP_UNDEFINEDIMAGESIZE          = 0x112d;
var ICAP_IMAGEDATASET                = 0x112e;
var ICAP_EXTIMAGEINFO                = 0x112f;
var ICAP_MINIMUMHEIGHT               = 0x1130;
var ICAP_MINIMUMWIDTH                = 0x1131;
var ICAP_AUTODISCARDBLANKPAGES       = 0x1134;
var ICAP_FLIPROTATION                = 0x1136;
var ICAP_BARCODEDETECTIONENABLED     = 0x1137;
var ICAP_SUPPORTEDBARCODETYPES       = 0x1138;
var ICAP_BARCODEMAXSEARCHPRIORITIES  = 0x1139;
var ICAP_BARCODESEARCHPRIORITIES     = 0x113a;
var ICAP_BARCODESEARCHMODE           = 0x113b;
var ICAP_BARCODEMAXRETRIES           = 0x113c;
var ICAP_BARCODETIMEOUT              = 0x113d;
var ICAP_ZOOMFACTOR                  = 0x113e;
var ICAP_PATCHCODEDETECTIONENABLED   = 0x113f;
var ICAP_SUPPORTEDPATCHCODETYPES     = 0x1140;
var ICAP_PATCHCODEMAXSEARCHPRIORITIES= 0x1141;
var ICAP_PATCHCODESEARCHPRIORITIES   = 0x1142;
var ICAP_PATCHCODESEARCHMODE         = 0x1143;
var ICAP_PATCHCODEMAXRETRIES         = 0x1144;
var ICAP_PATCHCODETIMEOUT            = 0x1145;
var ICAP_FLASHUSED2                  = 0x1146;
var ICAP_IMAGEFILTER                 = 0x1147;
var ICAP_NOISEFILTER                 = 0x1148;
var ICAP_OVERSCAN                    = 0x1149;
var ICAP_AUTOMATICBORDERDETECTION    = 0x1150;
var ICAP_AUTOMATICDESKEW             = 0x1151;
var ICAP_AUTOMATICROTATE             = 0x1152;
var ICAP_JPEGQUALITY                 = 0x1153;
var ICAP_FEEDERTYPE                  = 0x1154;
var ICAP_ICCPROFILE                  = 0x1155;
var ICAP_AUTOSIZE                    = 0x1156;
var ICAP_AUTOMATICCROPUSESFRAME      = 0x1157;
var ICAP_AUTOMATICLENGTHDETECTION    = 0x1158;
var ICAP_AUTOMATICCOLORENABLED       = 0x1159;
var ICAP_AUTOMATICCOLORNONCOLORPIXELTYPE= 0x115a;
var ICAP_COLORMANAGEMENTENABLED      = 0x115b;
var ICAP_IMAGEMERGE                  = 0x115c;
var ICAP_IMAGEMERGEHEIGHTTHRESHOLD   = 0x115d;
var ICAP_SUPPORTEDEXTIMAGEINFO       = 0x115e;
var ICAP_FILMTYPE                    = 0x115f;
var ICAP_MIRROR                      = 0x1160;
var ICAP_JPEGSUBSAMPLING             = 0x1161;

/* image data sources MAY support these audio caps */
var ACAP_XFERMECH                    = 0x1202;


/***************************************************************************
 *            Extended Image Info Attributes section  Added 1.7            *
 ***************************************************************************/

var TWEI_BARCODEX              = 0x1200;
var TWEI_BARCODEY              = 0x1201;
var TWEI_BARCODETEXT           = 0x1202;
var TWEI_BARCODETYPE           = 0x1203;
var TWEI_DESHADETOP            = 0x1204;
var TWEI_DESHADELEFT           = 0x1205;
var TWEI_DESHADEHEIGHT         = 0x1206;
var TWEI_DESHADEWIDTH          = 0x1207;
var TWEI_DESHADESIZE           = 0x1208;
var TWEI_SPECKLESREMOVED       = 0x1209;
var TWEI_HORZLINEXCOORD        = 0x120A;
var TWEI_HORZLINEYCOORD        = 0x120B;
var TWEI_HORZLINELENGTH        = 0x120C;
var TWEI_HORZLINETHICKNESS     = 0x120D;
var TWEI_VERTLINEXCOORD        = 0x120E;
var TWEI_VERTLINEYCOORD        = 0x120F;
var TWEI_VERTLINELENGTH        = 0x1210;
var TWEI_VERTLINETHICKNESS     = 0x1211;
var TWEI_PATCHCODE             = 0x1212;
var TWEI_ENDORSEDTEXT          = 0x1213;
var TWEI_FORMCONFIDENCE        = 0x1214;
var TWEI_FORMTEMPLATEMATCH     = 0x1215;
var TWEI_FORMTEMPLATEPAGEMATCH = 0x1216;
var TWEI_FORMHORZDOCOFFSET     = 0x1217;
var TWEI_FORMVERTDOCOFFSET     = 0x1218;
var TWEI_BARCODECOUNT          = 0x1219;
var TWEI_BARCODECONFIDENCE     = 0x121A;
var TWEI_BARCODEROTATION       = 0x121B;
var TWEI_BARCODETEXTLENGTH     = 0x121C;
var TWEI_DESHADECOUNT          = 0x121D;
var TWEI_DESHADEBLACKCOUNTOLD  = 0x121E;
var TWEI_DESHADEBLACKCOUNTNEW  = 0x121F;
var TWEI_DESHADEBLACKRLMIN     = 0x1220;
var TWEI_DESHADEBLACKRLMAX     = 0x1221;
var TWEI_DESHADEWHITECOUNTOLD  = 0x1222;
var TWEI_DESHADEWHITECOUNTNEW  = 0x1223;
var TWEI_DESHADEWHITERLMIN     = 0x1224;
var TWEI_DESHADEWHITERLAVE     = 0x1225;
var TWEI_DESHADEWHITERLMAX     = 0x1226;
var TWEI_BLACKSPECKLESREMOVED  = 0x1227;
var TWEI_WHITESPECKLESREMOVED  = 0x1228;
var TWEI_HORZLINECOUNT         = 0x1229;
var TWEI_VERTLINECOUNT         = 0x122A;
var TWEI_DESKEWSTATUS          = 0x122B;
var TWEI_SKEWORIGINALANGLE     = 0x122C;
var TWEI_SKEWFINALANGLE        = 0x122D;
var TWEI_SKEWCONFIDENCE        = 0x122E;
var TWEI_SKEWWINDOWX1          = 0x122F;
var TWEI_SKEWWINDOWY1          = 0x1230;
var TWEI_SKEWWINDOWX2          = 0x1231;
var TWEI_SKEWWINDOWY2          = 0x1232;
var TWEI_SKEWWINDOWX3          = 0x1233;
var TWEI_SKEWWINDOWY3          = 0x1234;
var TWEI_SKEWWINDOWX4          = 0x1235;
var TWEI_SKEWWINDOWY4          = 0x1236;
var TWEI_BOOKNAME              = 0x1238;
var TWEI_CHAPTERNUMBER         = 0x1239;
var TWEI_DOCUMENTNUMBER        = 0x123A;
var TWEI_PAGENUMBER            = 0x123B;
var TWEI_CAMERA                = 0x123C;
var TWEI_FRAMENUMBER           = 0x123D;
var TWEI_FRAME                 = 0x123E;
var TWEI_PIXELFLAVOR           = 0x123F;
var TWEI_ICCPROFILE            = 0x1240;
var TWEI_LASTSEGMENT           = 0x1241;
var TWEI_SEGMENTNUMBER         = 0x1242;
var TWEI_MAGDATA               = 0x1243;
var TWEI_MAGTYPE               = 0x1244;
var TWEI_PAGESIDE              = 0x1245;
var TWEI_FILESYSTEMSOURCE      = 0x1246;
var TWEI_IMAGEMERGED           = 0x1247;
var TWEI_MAGDATALENGTH         = 0x1248;
var TWEI_PAPERCOUNT            = 0x1249;
var TWEI_PRINTERTEXT           = 0x124A;

var TWEJ_NONE                  = 0x0000;
var TWEJ_MIDSEPARATOR          = 0x0001;
var TWEJ_PATCH1                = 0x0002;
var TWEJ_PATCH2                = 0x0003;
var TWEJ_PATCH3                = 0x0004;
var TWEJ_PATCH4                = 0x0005;
var TWEJ_PATCH6                = 0x0006;
var TWEJ_PATCHT                = 0x0007;


/***************************************************************************
 *            Return Codes and Condition Codes section                     *
 ***************************************************************************/

var TWRC_CUSTOMBASE    = 0x8000;

var TWRC_SUCCESS    =      0;
var TWRC_FAILURE     =     1;
var TWRC_CHECKSTATUS  =    2;
var TWRC_CANCEL        =   3;
var TWRC_DSEVENT        =  4;
var TWRC_NOTDSEVENT      = 5;
var TWRC_XFERDONE         =6;
var TWRC_ENDOFLIST       = 7;
var TWRC_INFONOTSUPPORTED =8;
var TWRC_DATANOTAVAILABLE= 9;
var TWRC_BUSY             =10;
var TWRC_SCANNERLOCKED    =11;

/* Condition Codes: Application gets these by doing DG_CONTROL DAT_STATUS MSG_GET.  */
var TWCC_CUSTOMBASE        = 0x8000;

var TWCC_SUCCESS     =       0; 
var TWCC_BUMMER       =      1 ;
var TWCC_LOWMEMORY     =     2 ;
var TWCC_NODS           =    3 ;
var TWCC_MAXCONNECTIONS  =   4 ;
var TWCC_OPERATIONERROR   =  5 ;
var TWCC_BADCAP            = 6 ;
var TWCC_BADPROTOCOL        =9 ;
var TWCC_BADVALUE      =     10;
var TWCC_SEQERROR       =    11;
var TWCC_BADDEST         =   12;
var TWCC_CAPUNSUPPORTED   =  13;
var TWCC_CAPBADOPERATION   = 14;
var TWCC_CAPSEQERROR        =15;
var TWCC_DENIED      =       16;
var TWCC_FILEEXISTS   =      17;
var TWCC_FILENOTFOUND  =     18;
var TWCC_NOTEMPTY       =    19;
var TWCC_PAPERJAM        =   20;
var TWCC_PAPERDOUBLEFEED  =  21;
var TWCC_FILEWRITEERROR    = 22;
var TWCC_CHECKDEVICEONLINE  =23;
var TWCC_INTERLOCK   =       24;
var TWCC_DAMAGEDCORNER=      25;
var TWCC_FOCUSERROR    =     26;
var TWCC_DOCTOOLIGHT    =    27;
var TWCC_DOCTOODARK      =   28;
var TWCC_NOMEDIA          =  29;

/* bit patterns: for query the operation that are supported by the data source on a capability */
/* Application gets these through DG_CONTROL/DAT_CAPABILITY/MSG_QUERYSUPPORT */
var TWQC_GET             = 0x0001 ;
var TWQC_SET             = 0x0002;
var TWQC_GETDEFAULT      = 0x0004;
var TWQC_GETCURRENT      = 0x0008;
var TWQC_RESET           = 0x0010;
var TWQC_SETCONSTRAINT   = 0x0020;
var TWQC_CONSTRAINABLE   = 0x0040;
var TWQC_GETHELP         = 0x0100;
var TWQC_GETLABEL        = 0x0200;
var TWQC_GETLABELENUM    = 0x0400;

/****************************************************************************
 * Depreciated Items                                                        *
 ****************************************************************************/
/*#if defined(WIN32) || defined(WIN64)
        var TW_HUGE
#elif !defined(TWH_CMP_GNU)
        var TW_HUGE    huge
#else
        var TW_HUGE
#endif


typedef BYTE TW_HUGE * HPBYTE;
typedef void TW_HUGE * HPVOID;

typedef unsigned char     TW_STR1024[1026],   FAR *pTW_STR1026, FAR *pTW_STR1024;
typedef wchar_t           TW_UNI512[512],     FAR *pTW_UNI512;*/

var TWTY_STR1024         = 0x000d;
var TWTY_UNI512          = 0x000e;

var TWFF_JPN        =      12;

var DAT_TWUNKIDENTITY    = 0x000b;
var DAT_SETUPFILEXFER2   = 0x0301;

var CAP_SUPPORTEDCAPSEXT     = 0x100c;
//var CAP_FILESYSTEM            //0x????
var CAP_PAGEMULTIPLEACQUIRE  = 0x1023;
var CAP_PAPERBINDING         = 0x102f;
var CAP_PASSTHRU             = 0x1031;
var CAP_POWERDOWNTIME        = 0x1034;
var ACAP_AUDIOFILEFORMAT     = 0x1201;

var MSG_CHECKSTATUS      = 0x0201;

var MSG_INVOKE_CALLBACK  = 0x0903;    /* Mac Only, deprecated - use DAT_NULL and MSG_xxx instead */

var TWSX_FILE2    =        3;

/* CAP_FILESYSTEM values (FS_ means file system) */
var TWFS_FILESYSTEM   =    0;
var TWFS_RECURSIVEDELETE = 1;

/* ICAP_PIXELTYPE values (PT_ means Pixel Type) */
var TWPT_SRGB64=     11;
var TWPT_BGR     =   12;
var TWPT_CIELAB  =   13;
var TWPT_CIELUV  =   14;
var TWPT_YCBCR   =   15;

/* ICAP_SUPPORTEDSIZES values (SS_ means Supported Sizes) */
var TWSS_B        =        8;
var TWSS_A4LETTER  =  TWSS_A4;   
var TWSS_B3      =   TWSS_ISOB3;
var TWSS_B4      =    TWSS_ISOB4;
var TWSS_B6       =   TWSS_ISOB6;
var TWSS_B5LETTER =   TWSS_JISB5;


/* ACAP_AUDIOFILEFORMAT values (AF_ means audio format).  Added 1.8 */
var TWAF_WAV =     0;
var TWAF_AIFF =    1;
var TWAF_AU    =   3;
var TWAF_SND    =  4;


/* DAT_SETUPFILEXFER2. Sets up DS to application data transfer via a file. Added 1.9 */
/*typedef struct {
   TW_MEMREF FileName;    
   TW_UINT16 FileNameType;
   TW_UINT16 Format;      
   TW_INT16  VRefNum;     
   TW_UINT32 parID;       
} TW_SETUPFILEXFER2, FAR * pTW_SETUPFILEXFER2;

/* DAT_TWUNKIDENTITY. Provides DS identity and 'other' information necessary */
/*                    across thunk link. */
/*typedef struct {
   TW_IDENTITY identity;
   TW_STR255   dsPath;  
} TW_TWUNKIDENTITY, FAR * pTW_TWUNKIDENTITY;

/* Provides DS_Entry parameters over thunk link. */
/*typedef struct
{
    TW_INT8     destFlag;   
    TW_IDENTITY dest;       
    TW_INT32    dataGroup;  
    TW_INT16    dataArgType;
    TW_INT16    message;    
    TW_INT32    pDataSize;  
    //  TW_MEMREF   pData;  
} TW_TWUNKDSENTRYPARAMS, FAR * pTW_TWUNKDSENTRYPARAMS;

/* Provides DS_Entry results over thunk link. */
/*typedef struct
{
    TW_UINT16   returnCode;   
    TW_UINT16   conditionCode;
    TW_INT32    pDataSize;    
    //  TW_MEMREF   pData;    
                              
                              
                              
} TW_TWUNKDSENTRYRETURN, FAR * pTW_TWUNKDSENTRYRETURN;

typedef struct
{
    TW_UINT16 Cap; 
    TW_UINT16 Properties; 
} TW_CAPEXT, FAR * pTW_CAPEXT;

/* DAT_SETUPAUDIOFILEXFER, information required to setup an audio file transfer */
/*typedef struct {
   TW_STR255  FileName; /* full path target file */
/*   TW_UINT16  Format;   /* one of TWAF_xxxx */
 /*  TW_INT16 VRefNum;
} TW_SETUPAUDIOFILEXFER, FAR * pTW_SETUPAUDIOFILEXFER;


/****************************************************************************
 * Entry Points                                                             *
 ****************************************************************************/

/**********************************************************************
 * Function: DSM_Entry, the only entry point into the Data Source Manager.
 ********************************************************************/
/*#ifdef TWH_CMP_MSC
  var TW_CALLINGSTYLE PASCAL
#else
  var TW_CALLINGSTYLE
#endif

/* Don't mangle the name "DSM_Entry" if we're compiling in C++! */
/*#ifdef  __cplusplus
extern "C" {
#endif  /* __cplusplus */
/*
TW_UINT16 TW_CALLINGSTYLE DSM_Entry( pTW_IDENTITY pOrigin,
                                pTW_IDENTITY pDest,
                                TW_UINT32    DG,
                                TW_UINT16    DAT,
                                TW_UINT16    MSG,
                                TW_MEMREF    pData);

typedef TW_UINT16 (TW_CALLINGSTYLE *DSMENTRYPROC)(pTW_IDENTITY pOrigin,
                                             pTW_IDENTITY pDest,
                                             TW_UINT32 DG,
                                             TW_UINT16 DAT,
                                             TW_UINT16 MSG,
                                             TW_MEMREF pData);
#ifdef  __cplusplus
}
#endif  /* cplusplus */


/**********************************************************************
 * Function: DS_Entry, the entry point provided by a Data Source.
 ********************************************************************/
/* Don't mangle the name "DS_Entry" if we're compiling in C++! */
/*#ifdef  __cplusplus
extern "C" {
#endif  /* __cplusplus */

/*
TW_UINT16 TW_CALLINGSTYLE DS_Entry(pTW_IDENTITY pOrigin,
                              TW_UINT32 DG, 
                              TW_UINT16 DAT, 
                              TW_UINT16 MSG,
                              TW_MEMREF pData);

typedef TW_UINT16 (FAR PASCAL *DSENTRYPROC)(pTW_IDENTITY pOrigin,
                                            TW_UINT32 DG,
                                            TW_UINT16 DAT,
                                            TW_UINT16 MSG,
                                            TW_MEMREF pData);

TW_UINT16 TW_CALLINGSTYLE TWAIN_Callback(   pTW_IDENTITY pOrigin,
                                            pTW_IDENTITY pDest,
                                            TW_UINT32 DG,
                                            TW_UINT16 DAT,
                                            TW_UINT16 MSG,
                                            TW_MEMREF pData);
typedef TW_UINT16 (TW_CALLINGSTYLE *TWAINCALLBACKPROC)(pTW_IDENTITY pOrigin,
                                            pTW_IDENTITY pDest,
                                            TW_UINT32 DG,
                                            TW_UINT16 DAT,
                                            TW_UINT16 MSG,
                                            TW_MEMREF pData);

TW_HANDLE TW_CALLINGSTYLE DSM_MemAllocate (TW_UINT32);
typedef TW_HANDLE (TW_CALLINGSTYLE *DSM_MEMALLOCATE)(TW_UINT32 _size);

void TW_CALLINGSTYLE DSM_MemFree (TW_HANDLE);
typedef void (TW_CALLINGSTYLE *DSM_MEMFREE)(TW_HANDLE _handle);

TW_MEMREF TW_CALLINGSTYLE DSM_MemLock (TW_HANDLE);
typedef TW_MEMREF (TW_CALLINGSTYLE *DSM_MEMLOCK)(TW_HANDLE _handle);

void TW_CALLINGSTYLE DSM_MemUnlock (TW_HANDLE);
typedef void (TW_CALLINGSTYLE *DSM_MEMUNLOCK)(TW_HANDLE _handle);

#ifdef  __cplusplus
}
#endif  /* __cplusplus */

/* DAT_ENTRYPOINT. returns essential entry points. */
/*typedef struct {
   TW_UINT32         Size;
   DSMENTRYPROC      DSM_Entry;
   DSM_MEMALLOCATE   DSM_MemAllocate;
   DSM_MEMFREE       DSM_MemFree;
   DSM_MEMLOCK       DSM_MemLock;
   DSM_MEMUNLOCK     DSM_MemUnlock;
} TW_ENTRYPOINT, FAR * pTW_ENTRYPOINT;

/* DAT_FILTER*/
/*typedef struct {
  TW_UINT32 Size;
  TW_UINT32 HueStart; 
  TW_UINT32 HueEnd;   
  TW_UINT32 SaturationStart;
  TW_UINT32 SaturationEnd;  
  TW_UINT32 ValueStart;
  TW_UINT32 ValueEnd;  
  TW_UINT32 Replacement;       
} TW_FILTER_DESCRIPTOR, *pTW_FILTER_DESCRIPTOR;

/* DAT_FILTER */
/*typedef struct {
  TW_UINT32 Size;
  TW_UINT32 DescriptorCount;
  TW_UINT32 MaxDescriptorCount;
  TW_UINT32 Condition;
  TW_HANDLE hDescriptors; 
} TW_FILTER, *pTW_FILTER;


/* Restore the previous packing alignment: this occurs after all structures are defined */
/*#ifdef TWH_CMP_MSC
    #pragma pack (pop, before_twain)
#elif defined(TWH_CMP_GNU)
    #if defined(__APPLE__) /* cf: Mac version of TWAIN.h */
 /*       #pragma options align = reset
    #else
        #pragma pack (pop, before_twain)
    #endif
#elif defined(TWH_CMP_BORLAND)
    #pragma option �a.
#endif

#endif  /* TWAIN */
