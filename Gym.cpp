// Adrianna Allen
// Assignment: B6-1
// Calculate gymnastics sports team scores

#include <iostream>
#include <math.h>
#include <string>
#include <iomanip>
using namespace std;

int main()
{
	string name, dummy;
	int points = 0, total = 0, events = 0, gymnast;
	double average = 0, gym_average = 0, all_gym = 0, gym_total = 0;
	char repeat;
	do
	{
		
		cout << "Please enter the number of gymnasts on the team? ";
			cin >> gymnast;
		cout << "Please enter the number of events the teams competed in: ? ";
		   cin >> events;
				
		   for (int i = 1; i <= gymnast; i++)
		   {
			   cin.ignore();
			   cout << " Enter gymnast " << i << "'s name: ? ";
			   getline(cin, name);

			   cout << "Enter the points earned by " << name << " for each event" << endl;

			   gym_total = 0;
			   for (int j = 1; j <= events; j++)
			   {
				   total++;

				   do
				   { 
					   points++;
					   cout << "Event " << j << ": ";
					   cin >> points;

					   if (points > 10 || points < 0)
						   cout << "****ERROR -- INVALID SCORE -- PLEASE RE-ENTER**** " << endl;
				   } while (points > 10);

				   gym_total = points +  gym_total;
				   
				   gym_average = gym_total / events;

			   }
			 
			   cout << " \n";
			   cout << name << " :" << endl;
			   cout << "Total Points: " << gym_total << endl;
			   {
				   cout << "Average Points: " << gym_average << endl;
				   cout << fixed << setprecision(1);
			   }
            }getline(cin, dummy);
			    
			   total = total + gym_total; 
				average = total / events;
				cout << fixed << setprecision(1);
				cout << "  \n";
				cout << "Total Team Points: " << total << endl;
				cout << "Average  Team Points per Event: " << average << endl;
				cout << "Would you like to calculate the stats on another team? Y or N ";
				cin >> repeat;

		   }while (repeat == 'Y' || repeat == 'y');

}