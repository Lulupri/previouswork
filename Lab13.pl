#!/Perl64/bin/perl


use strict;
use warnings;
use Data::Dumper qw(Dumper);

sub main{
    my $temp;
    my $RH;
$temp = $ARGV[0]; #taking input from command line. Temprature at index 0
$RH = $ARGV[1];     #taking input from command line. RH% at index 1
if($temp <= -50 || $temp >= 150)    #checking if temprature is out of range
{
print "Invalid temprature $temp\n" #printing error message if above condition is true.
}
else
{
print "Temprature:\t$temp\n" #printing temprature
}
if($RH <= 0 || $RH >= 100) #checking if RH% is out of range
{
print "Entered RH value $RH is out of range."     #printing error message if above condition is true.
}
else
{
print "RH(%):\t\t\t\t$RH\n " #printing RH if in range
}

}