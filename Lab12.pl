
#!/usr/bin/perl
use strict;
use warnings;

sub main{


    my @favfoods = ("Pizza", "Nachos", "Sushi", "Ice Cream", "Steak");
    my @disfoods = ("Orka", "Cabbage", "Green Beans", "Chocolate", "Liver");
    print "Favorite Foods:\n";
    print "$favfoods[0]\n";
    print "$favfoods[1]\n";
    print "$favfoods[2]\n";
  #The Top Three Favorites
    print "$disfoods[0] , $disfoods[5]\n";
    ($disfoods[5], $disfoods[0]) = ($disfoods[0], $disfoods[5]);
    print "$disfoods[0] , $disfoods[5]\n";
    print "Input Another Food you dislike: ";
    my $another = <STDIN>;
    chomp($another);
    push @disfoods,$another;
    print "$disfoods[5] , $disfoods[6]";


  }